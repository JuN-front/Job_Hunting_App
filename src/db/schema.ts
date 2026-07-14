import {
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Users ───────────────────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  passwordHash: text("password_hash"),
  name: text("name"),
  image: text("image"),
  logoBase64: text("logo_base64"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (account) => ({
  compoundKey: primaryKey({ columns: [account.provider, account.providerAccountId] }),
}));

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({
  compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
}));

// ─── Companies ───────────────────────────────────────────────────────────────
export const COMPANY_STATUSES = [
  "説明会",
  "IS内定",
  "IS不合格/抽選落ち",
  "ES提出",
  "一次選考/面接",
  "カジュアル面談",
  "二次面接以降",
  "最終面接",
  "内定",
  "入社検討候補",
  "辞退",
  "本選考不合格",
] as const;

export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const companies = pgTable("companies", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  status: text("status").$type<CompanyStatus>().notNull().default("説明会"),
  status2: text("status2").$type<CompanyStatus>(),
  industry: text("industry"),
  url: text("url"),
  recruitUrl: text("recruit_url"),
  mypageUrl: text("mypage_url"),
  mypageId: text("mypage_id"),
  mypagePassword: text("mypage_password"),
  // 3C分析
  company3c: text("company_3c"),
  swotStrength: text("swot_strength"),
  swotWeakness: text("swot_weakness"),
  swotOpportunity: text("swot_opportunity"),
  swotThreat: text("swot_threat"),
  // VMV
  vision: text("vision"),
  mission: text("mission"),
  companyValue: text("company_value"),
  customers: text("customers"),
  competitors: text("competitors"),
  // その他
  strengths: text("strengths"),
  notes: text("notes"),
  eventDate: timestamp("event_date", { mode: "date" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Tags ─────────────────────────────────────────────────────────────────────
export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  color: text("color").notNull().default("#7c6af7"),
});

// ─── Company Tags ──────────────────────────────────────────────────────────────
export const companyTags = pgTable("company_tags", {
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  tagId: uuid("tag_id").notNull().references(() => tags.id, { onDelete: "cascade" }),
}, (ct) => ({
  compoundKey: primaryKey({ columns: [ct.companyId, ct.tagId] }),
}));

// ─── Memos ────────────────────────────────────────────────────────────────────
export const TEMPLATE_TYPES = [
  "企業研究",
  "面接メモ",
  "ES・書類",
  "OB/OG訪問",
  "説明会メモ",
  "自由メモ",
] as const;

export type TemplateType = (typeof TEMPLATE_TYPES)[number];

export const memos = pgTable("memos", {
  id: uuid("id").primaryKey().defaultRandom(),
  companyId: uuid("company_id").notNull().references(() => companies.id, { onDelete: "cascade" }),
  templateType: text("template_type").$type<TemplateType>().notNull().default("自由メモ"),
  title: text("title").notNull().default("メモ"),
  content: text("content").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── Relations ────────────────────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  companies: many(companies),
  tags: many(tags),
}));

export const companiesRelations = relations(companies, ({ one, many }) => ({
  user: one(users, { fields: [companies.userId], references: [users.id] }),
  companyTags: many(companyTags),
  memos: many(memos),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(users, { fields: [tags.userId], references: [users.id] }),
  companyTags: many(companyTags),
}));

export const companyTagsRelations = relations(companyTags, ({ one }) => ({
  company: one(companies, { fields: [companyTags.companyId], references: [companies.id] }),
  tag: one(tags, { fields: [companyTags.tagId], references: [tags.id] }),
}));

export const memosRelations = relations(memos, ({ one }) => ({
  company: one(companies, { fields: [memos.companyId], references: [companies.id] }),
}));
