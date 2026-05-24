import { z } from "zod";

import type { UploadSignRequest, UploadSignResponse } from "../../types/upload";
import {
  buildUploadFolder,
  generateUploadIntent,
  generateUploadSignature
} from "../cloudinary/utility";
import { findUploadAssetByUserAndHash } from "../repositories/asset-repository";
import { validateImageFilePolicy } from "../utils/file-policy";

export type UploadSignServiceResult =
  | {
      ok: true;
      data: UploadSignResponse;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

const uploadSignRequestSchema = z.object({
  userId: z.string().min(1).max(128),
  imageHash: z.string().min(8).max(128),
  fileName: z.string().min(1).max(255),
  fileSize: z.number().int().positive(),
  mimeType: z.string().min(1).max(100)
});

export async function createUploadSignature(
  payload: unknown
): Promise<UploadSignServiceResult> {
  const parsed = uploadSignRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "图片读取失败，请重新选择一张。"
    };
  }

  const input: UploadSignRequest = parsed.data;

  const policyResult = validateImageFilePolicy({
    size: input.fileSize,
    type: input.mimeType
  });

  if (!policyResult.ok) {
    return {
      ok: false,
      status: 400,
      message: policyResult.message
    };
  }

  const existingAsset = await findUploadAssetByUserAndHash(
    input.userId,
    input.imageHash
  );

  if (existingAsset) {
    return {
      ok: true,
      data: {
        reuse: true,
        asset: {
          id: existingAsset.id,
          publicId: existingAsset.publicId,
          secureUrl: existingAsset.secureUrl,
          width: existingAsset.width,
          height: existingAsset.height,
          bytes: existingAsset.bytes,
          etag: existingAsset.etag,
          imageHash: existingAsset.imageHash
        }
      }
    };
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey || !process.env.CLOUDINARY_API_SECRET) {
    return {
      ok: false,
      status: 500,
      message: "上传服务暂时不可用，请稍后再试。"
    };
  }

  const folder = buildUploadFolder(input.userId);
  const timestamp = Math.floor(Date.now() / 1000);
  const signature = generateUploadSignature({
    folder,
    timestamp,
    colors: true
  });
  const uploadIntent = generateUploadIntent({
    userId: input.userId,
    imageHash: input.imageHash,
    folder,
    timestamp
  });

  return {
    ok: true,
    data: {
      reuse: false,
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
      uploadIntent,
      colors: true
    }
  };
}
