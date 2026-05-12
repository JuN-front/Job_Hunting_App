CREATE TABLE IF NOT EXISTS "users" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text UNIQUE NOT NULL,
  "email_verified" timestamp,
  "password_hash" text,
  "name" text,
  "image" text,
  "created_at" timestamp DEFAULT now() NOT NULL
);
