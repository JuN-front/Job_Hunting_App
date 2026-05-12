ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "logo_base64" text;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "recruit_url" text;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "mypage_url" text;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "strengths" text;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "customers" text;
ALTER TABLE "companies" ADD COLUMN IF NOT EXISTS "competitors" text;
