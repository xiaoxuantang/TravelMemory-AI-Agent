export type CloudinaryConfig = {
  cloudName: string | undefined;
  apiKey: string | undefined;
  apiSecret: string | undefined;
};

export function getCloudinaryConfig(): CloudinaryConfig {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  };
}
