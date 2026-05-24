export type FilePolicyInput = {
  size: number;
  type: string;
};

export type UploadSignRequest = {
  userId: string;
  imageHash: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
};

export type UploadAssetMetadata = {
  inference: {
    url512: string;
    transform: string;
  };
  colors?: unknown;
  cloudinary?: {
    etag?: string;
    format?: string;
  };
};

export type UploadAsset = {
  id: number;
  userId: string;
  imageHash: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  etag: string | null;
  format: string | null;
  metadata: UploadAssetMetadata;
};

export type ReusableUploadSignResponse = {
  reuse: true;
  asset: {
    id: number;
    publicId: string;
    secureUrl: string;
    width: number;
    height: number;
    bytes: number;
    etag: string | null;
    imageHash: string;
  };
};

export type NewUploadSignResponse = {
  reuse: false;
  cloudName: string;
  apiKey: string;
  timestamp: number;
  folder: string;
  signature: string;
  uploadIntent: string;
  colors: true;
};

export type UploadSignResponse =
  | ReusableUploadSignResponse
  | NewUploadSignResponse;

export type CloudinaryUploadResult = {
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  etag?: string;
  format?: string;
  colors?: unknown;
};

export type CreateAssetRequest = {
  userId: string;
  imageHash: string;
  uploadIntent: string;
  publicId: string;
  secureUrl: string;
  width: number;
  height: number;
  bytes: number;
  etag?: string;
  format?: string;
  metadata?: Record<string, unknown>;
};
