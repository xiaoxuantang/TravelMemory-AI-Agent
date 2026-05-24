CREATE TABLE IF NOT EXISTS "upload_assets" (
  "id" bigserial PRIMARY KEY NOT NULL,
  "user_id" text NOT NULL,
  "image_hash" text NOT NULL,
  "public_id" text NOT NULL,
  "secure_url" text NOT NULL,
  "width" integer NOT NULL,
  "height" integer NOT NULL,
  "bytes" integer NOT NULL,
  "etag" text,
  "format" text,
  "metadata" jsonb NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS "upload_assets_user_image_hash_idx"
  ON "upload_assets" ("user_id", "image_hash");

CREATE INDEX IF NOT EXISTS "upload_assets_user_idx"
  ON "upload_assets" ("user_id");

CREATE INDEX IF NOT EXISTS "upload_assets_image_hash_idx"
  ON "upload_assets" ("image_hash");

CREATE INDEX IF NOT EXISTS "upload_assets_created_at_idx"
  ON "upload_assets" ("created_at");
