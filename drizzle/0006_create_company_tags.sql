CREATE TABLE IF NOT EXISTS "company_tags" (
  "company_id" uuid NOT NULL REFERENCES "companies"("id") ON DELETE CASCADE,
  "tag_id" uuid NOT NULL REFERENCES "tags"("id") ON DELETE CASCADE,
  PRIMARY KEY ("company_id", "tag_id")
);
