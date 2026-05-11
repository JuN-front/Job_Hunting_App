CREATE TABLE IF NOT EXISTS "sessions" (
  "session_token" text PRIMARY KEY NOT NULL,
  "user_id" uuid NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "expires" timestamp NOT NULL
);
