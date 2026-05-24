import { createHash } from "crypto";

const inferenceTransform = "w_512,c_limit,q_auto,f_auto";

export type UploadSignatureInput = {
  folder: string;
  timestamp: number;
  colors?: true;
};

export function buildUploadFolder(userId: string): string {
  return `travelmemory/${encodeURIComponent(userId)}/uploads`;
}

export function buildInferenceImageUrl512(publicId: string): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    ?? process.env.CLOUDINARY_CLOUD_NAME;

  if (!cloudName) {
    return "";
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${inferenceTransform}/${publicId}`;
}

export function getInferenceTransform(): string {
  return inferenceTransform;
}

export function generateUploadSignature(input: UploadSignatureInput): string {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error("Missing CLOUDINARY_API_SECRET");
  }

  const params = {
    colors: input.colors ? "true" : undefined,
    folder: input.folder,
    timestamp: String(input.timestamp)
  };

  const signaturePayload = Object.entries(params)
    .filter((entry): entry is [string, string] => Boolean(entry[1]))
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1")
    .update(`${signaturePayload}${apiSecret}`)
    .digest("hex");
}

export function generateUploadIntent(input: {
  userId: string;
  imageHash: string;
  folder: string;
  timestamp: number;
}): string {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!apiSecret) {
    throw new Error("Missing CLOUDINARY_API_SECRET");
  }

  return createHash("sha256")
    .update(`${input.userId}:${input.imageHash}:${input.folder}:${input.timestamp}:${apiSecret}`)
    .digest("hex");
}

export function verifyUploadIntent(input: {
  userId: string;
  imageHash: string;
  publicId: string;
  timestamp?: number;
  uploadIntent: string;
}): boolean {
  const folder = buildUploadFolder(input.userId);

  if (!input.publicId.startsWith(`${folder}/`)) {
    return false;
  }

  if (!input.timestamp) {
    return false;
  }

  const expectedIntent = generateUploadIntent({
    userId: input.userId,
    imageHash: input.imageHash,
    folder,
    timestamp: input.timestamp
  });

  return expectedIntent === input.uploadIntent;
}
