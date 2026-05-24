"use client";

import { useEffect, useRef, useState } from "react";

import type {
  CloudinaryUploadResult,
  NewUploadSignResponse,
  UploadSignResponse
} from "../../types/upload";
import { calculateImageHash } from "../../lib/utils/image-hash";
import { validateImageFilePolicy } from "../../lib/utils/file-policy";
import { UploadProgress } from "./UploadProgress";

type PhotoUploaderProps = {
  userId?: string;
};

type UploadState =
  | "idle"
  | "preview"
  | "hashing"
  | "signing"
  | "uploading"
  | "saving"
  | "uploaded"
  | "unavailable"
  | "failed";

function isNewUploadResponse(response: UploadSignResponse): response is NewUploadSignResponse {
  return response.reuse === false;
}

function getInitialAnonymousUserId(userId?: string): string | null {
  if (userId) {
    return userId;
  }

  if (typeof window === "undefined") {
    return null;
  }

  const storageKey = "travelmemory.anonymousUserId";
  const existingUserId = window.localStorage.getItem(storageKey);

  if (existingUserId) {
    return existingUserId;
  }

  const nextUserId = `anon_${crypto.randomUUID()}`;
  window.localStorage.setItem(storageKey, nextUserId);

  return nextUserId;
}

function normalizeCloudinaryResult(value: Record<string, unknown>): CloudinaryUploadResult {
  return {
    publicId: String(value.public_id ?? ""),
    secureUrl: String(value.secure_url ?? ""),
    width: Number(value.width ?? 0),
    height: Number(value.height ?? 0),
    bytes: Number(value.bytes ?? 0),
    etag: typeof value.etag === "string" ? value.etag : undefined,
    format: typeof value.format === "string" ? value.format : undefined,
    colors: value.colors
  };
}

async function requestUploadSignature(
  userId: string,
  file: File,
  imageHash: string
): Promise<UploadSignResponse> {
  const response = await fetch("/api/upload-sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      imageHash,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "上传服务暂时不可用，请稍后再试。");
  }

  return payload as UploadSignResponse;
}

function uploadToCloudinary(
  file: File,
  signResponse: NewUploadSignResponse,
  onProgress: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", signResponse.apiKey);
    formData.append("timestamp", String(signResponse.timestamp));
    formData.append("folder", signResponse.folder);
    formData.append("signature", signResponse.signature);
    formData.append("colors", String(signResponse.colors));

    const xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${signResponse.cloudName}/image/upload`
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      try {
        const payload = JSON.parse(xhr.responseText) as Record<string, unknown>;

        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(normalizeCloudinaryResult(payload));
          return;
        }

        reject(new Error("上传失败，请稍后重试。"));
      } catch {
        reject(new Error("上传失败，请稍后重试。"));
      }
    };

    xhr.onerror = () => {
      reject(new Error("上传失败，请检查网络后重试。"));
    };

    xhr.send(formData);
  });
}

async function persistAsset(
  userId: string,
  imageHash: string,
  uploadResult: CloudinaryUploadResult,
  signResponse: NewUploadSignResponse
) {
  const response = await fetch("/api/assets", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      userId,
      imageHash,
      uploadIntent: signResponse.uploadIntent,
      timestamp: signResponse.timestamp,
      publicId: uploadResult.publicId,
      secureUrl: uploadResult.secureUrl,
      width: uploadResult.width,
      height: uploadResult.height,
      bytes: uploadResult.bytes,
      etag: uploadResult.etag,
      format: uploadResult.format,
      metadata: {
        colors: uploadResult.colors,
        cloudinary: {
          etag: uploadResult.etag,
          format: uploadResult.format
        }
      }
    })
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "图片信息保存失败，请重试。");
  }

  return payload;
}

export function PhotoUploader({ userId }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [anonymousUserId] = useState<string | null>(() => getInitialAnonymousUserId(userId));
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageHash, setImageHash] = useState<string | null>(null);
  const [status, setStatus] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("选择旅行照片");

  const isBusy = status === "hashing"
    || status === "signing"
    || status === "uploading"
    || status === "saving";

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  async function runUpload(nextFile: File, existingHash?: string) {
    if (!anonymousUserId) {
      setStatus("failed");
      setMessage("上传准备中，请稍后再试。");
      return;
    }

    try {
      setStatus("hashing");
      setProgress(0);
      setMessage("正在计算图片身份…");

      const nextHash = existingHash ?? await calculateImageHash(nextFile);
      setImageHash(nextHash);

      setStatus("signing");
      setMessage("正在准备安全上传…");
      const signResponse = await requestUploadSignature(anonymousUserId, nextFile, nextHash);

      if (signResponse.reuse) {
        setProgress(100);
        setStatus("uploaded");
        setMessage("这张照片已经准备好了。");
        return;
      }

      if (isNewUploadResponse(signResponse)) {
        setStatus("uploading");
        setMessage("正在上传到云端相册…");
        const uploadResult = await uploadToCloudinary(nextFile, signResponse, setProgress);

        setStatus("saving");
        setMessage("正在保存照片信息…");
        await persistAsset(anonymousUserId, nextHash, uploadResult, signResponse);

        setProgress(100);
        setStatus("uploaded");
        setMessage("照片已准备好，可以继续生成旅行记忆。");
      }
    } catch (error) {
      const nextMessage = error instanceof Error ? error.message : "上传失败，请稍后重试。";
      setStatus(nextMessage.includes("上传服务暂时不可用") ? "unavailable" : "failed");
      setMessage(nextMessage);
    }
  }

  function handleFile(nextFile: File | undefined) {
    if (!nextFile) {
      setStatus("failed");
      setMessage("图片读取失败，请重新选择一张。");
      return;
    }

    const policyResult = validateImageFilePolicy(nextFile);

    if (!policyResult.ok) {
      setFile(null);
      setImageHash(null);
      setProgress(0);
      setStatus("failed");
      setMessage(policyResult.message);
      return;
    }

    setFile(nextFile);
    setStatus("preview");
    setProgress(0);
    setMessage("本地预览已准备好，正在继续上传。");
    void runUpload(nextFile);
  }

  function handleRetry() {
    if (!file) {
      inputRef.current?.click();
      return;
    }

    void runUpload(file, imageHash ?? undefined);
  }

  return (
    <section className="space-y-4">
      <div
        className="tm-panel p-4"
        onDragOver={(event) => {
          event.preventDefault();
        }}
        onDrop={(event) => {
          event.preventDefault();
          handleFile(event.dataTransfer.files[0]);
        }}
      >
        <label htmlFor="photo" className="tm-upload-zone">
          <span className="text-base font-semibold text-tm-text">
            {status === "idle" ? "选择旅行照片" : "重新选择旅行照片"}
          </span>
          <span className="mt-2 text-sm leading-6 text-tm-muted">
            点击选择，或把照片拖到这里。默认使用第一张照片作为主图。
          </span>
        </label>
        <input
          ref={inputRef}
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            handleFile(event.target.files?.[0]);
          }}
        />
      </div>

      <section className="tm-card p-4">
        <div className="flex aspect-[9/16] w-full items-center justify-center overflow-hidden rounded-tm-card border border-tm-border bg-tm-surface-soft p-3 shadow-tm-soft">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="旅行照片预览"
              className="max-h-full max-w-full rounded-tm-btn object-contain shadow-tm-soft"
            />
          ) : null}
        </div>
        <p className="mt-3 text-center text-sm text-tm-muted">
          {previewUrl ? "本地预览已准备好" : "照片预览区域"}
        </p>
      </section>

      {status !== "idle" ? (
        <div className="tm-card space-y-3 p-4">
          {isBusy || status === "uploaded" ? (
            <UploadProgress
              progress={progress}
              label={
                status === "hashing"
                  ? "正在计算图片身份…"
                  : status === "signing"
                    ? "正在准备安全上传…"
                    : status === "uploading"
                      ? "正在上传到云端相册…"
                      : status === "saving"
                        ? "正在保存照片信息…"
                        : "上传完成"
              }
            />
          ) : null}
          <p className="text-sm text-tm-muted">{message}</p>
          {status === "preview" ? (
            <p className="text-xs text-tm-muted">
              你可以先确认照片构图，系统会继续完成云端上传。
            </p>
          ) : null}
          {status === "unavailable" ? (
            <p className="text-xs text-tm-muted">
              本地预览可继续查看，但云端上传尚未完成。
            </p>
          ) : null}
          {status === "failed" || status === "unavailable" ? (
            <button
              type="button"
              className="tm-chip tm-chip-active w-full"
              onClick={handleRetry}
            >
              重试上传
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
