CREATE TABLE IF NOT EXISTS "memos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
  "template_type" text DEFAULT '自由メモ' NOT NULL,
  "title" text DEFAULT 'メモ' NOT NULL,
  "content" text DEFAULT '' NOT NULL,
  "created_at" timestamp DEFAULT now() NOT NULL,
  "updated_at" timestamp DEFAULT now() NOT NULL
);
