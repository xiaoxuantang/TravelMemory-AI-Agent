import { and, eq } from "drizzle-orm";

import { getDb } from "../db";
import { uploadAssets } from "../db/schema";
import type { CreateAssetRequest, UploadAsset, UploadAssetMetadata } from "../../types/upload";

function mapAsset(row: typeof uploadAssets.$inferSelect): UploadAsset {
  return {
    id: row.id,
    userId: row.userId,
    imageHash: row.imageHash,
    publicId: row.publicId,
    secureUrl: row.secureUrl,
    width: row.width,
    height: row.height,
    bytes: row.bytes,
    etag: row.etag,
    format: row.format,
    metadata: row.metadata
  };
}

export async function findUploadAssetByUserAndHash(
  userId: string,
  imageHash: string
): Promise<UploadAsset | null> {
  const db = getDb();
  const rows = await db
    .select()
    .from(uploadAssets)
    .where(and(eq(uploadAssets.userId, userId), eq(uploadAssets.imageHash, imageHash)))
    .limit(1);

  return rows[0] ? mapAsset(rows[0]) : null;
}

export async function upsertUploadAsset(
  input: CreateAssetRequest,
  metadata: UploadAssetMetadata
): Promise<UploadAsset> {
  const db = getDb();
  const rows = await db
    .insert(uploadAssets)
    .values({
      userId: input.userId,
      imageHash: input.imageHash,
      publicId: input.publicId,
      secureUrl: input.secureUrl,
      width: input.width,
      height: input.height,
      bytes: input.bytes,
      etag: input.etag,
      format: input.format,
      metadata
    })
    .onConflictDoUpdate({
      target: [uploadAssets.userId, uploadAssets.imageHash],
      set: {
        publicId: input.publicId,
        secureUrl: input.secureUrl,
        width: input.width,
        height: input.height,
        bytes: input.bytes,
        etag: input.etag,
        format: input.format,
        metadata
      }
    })
    .returning();

  return mapAsset(rows[0]);
}
