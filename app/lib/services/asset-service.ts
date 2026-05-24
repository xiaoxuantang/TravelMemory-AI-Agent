import { z } from "zod";

import type { CreateAssetRequest, UploadAsset, UploadAssetMetadata } from "../../types/upload";
import {
  buildInferenceImageUrl512,
  getInferenceTransform,
  verifyUploadIntent
} from "../cloudinary/utility";
import { upsertUploadAsset } from "../repositories/asset-repository";

export type AssetServiceResult =
  | {
      ok: true;
      asset: UploadAsset;
    }
  | {
      ok: false;
      status: number;
      message: string;
    };

const createAssetRequestSchema = z.object({
  userId: z.string().min(1).max(128),
  imageHash: z.string().min(8).max(128),
  uploadIntent: z.string().length(64),
  timestamp: z.number().int().positive().optional(),
  publicId: z.string().min(1).max(512),
  secureUrl: z.string().url(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  bytes: z.number().int().positive(),
  etag: z.string().max(255).optional(),
  format: z.string().max(32).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export async function persistUploadAsset(payload: unknown): Promise<AssetServiceResult> {
  const parsed = createAssetRequestSchema.safeParse(payload);

  if (!parsed.success) {
    return {
      ok: false,
      status: 400,
      message: "图片信息保存失败，请重试。"
    };
  }

  const input = parsed.data satisfies CreateAssetRequest & { timestamp?: number };

  if (!verifyUploadIntent(input)) {
    return {
      ok: false,
      status: 403,
      message: "图片信息校验失败，请重新上传。"
    };
  }

  const incomingMetadata = (
    input.metadata && typeof input.metadata === "object"
      ? input.metadata
      : {}
  ) as Record<string, unknown>;

  const metadata: UploadAssetMetadata = {
    ...incomingMetadata,
    colors: incomingMetadata.colors,
    cloudinary: {
      ...(typeof incomingMetadata.cloudinary === "object" && incomingMetadata.cloudinary
        ? incomingMetadata.cloudinary
        : {}),
      etag: input.etag,
      format: input.format
    },
    inference: {
      url512: buildInferenceImageUrl512(input.publicId),
      transform: getInferenceTransform()
    }
  };

  const asset = await upsertUploadAsset(input, metadata);

  return {
    ok: true,
    asset
  };
}
