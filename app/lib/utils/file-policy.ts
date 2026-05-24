import type { FilePolicyInput } from "../../types/upload";

export const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
] as const;

export const maxUploadFileSizeBytes = 8 * 1024 * 1024;

export type FilePolicyResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      message: string;
    };

export function validateImageFilePolicy(input: FilePolicyInput): FilePolicyResult {
  if (!input.size || input.size <= 0) {
    return {
      ok: false,
      message: "图片读取失败，请重新选择一张。"
    };
  }

  if (!allowedImageMimeTypes.includes(input.type as (typeof allowedImageMimeTypes)[number])) {
    return {
      ok: false,
      message: "暂不支持这个格式，请上传 JPG、PNG 或 WebP。"
    };
  }

  if (input.size > maxUploadFileSizeBytes) {
    return {
      ok: false,
      message: "这张照片太大了，请上传 8MB 以内的图片。"
    };
  }

  return { ok: true };
}
