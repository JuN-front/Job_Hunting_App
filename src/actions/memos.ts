"use server";

import { db } from "@/db";
import { memos, companies } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { TemplateType } from "@/db/schema";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id as string;
}

export async function createMemo(companyId: string, formData: FormData) {
  const userId = await getSession();

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, companyId), eq(companies.userId, userId)),
  });
  if (!company) throw new Error("企業が見つかりません");

  const title = (formData.get("title") as string) || "メモ";
  const templateType = (formData.get("templateType") as TemplateType) ?? "自由メモ";
  const content = (formData.get("content") as string) || "";

  await db.insert(memos).values({ companyId, title, templateType, content });

  revalidatePath(`/companies/${companyId}`);
  redirect(`/companies/${companyId}`);
}

export async function updateMemo(id: string, companyId: string, formData: FormData) {
  const userId = await getSession();

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, companyId), eq(companies.userId, userId)),
  });
  if (!company) throw new Error("Unauthorized");

  const title = (formData.get("title") as string) || "メモ";
  const content = (formData.get("content") as string) || "";

  await db
    .update(memos)
    .set({ title, content, updatedAt: new Date() })
    .where(eq(memos.id, id));

  revalidatePath(`/companies/${companyId}`);
}

export async function deleteMemo(id: string, companyId: string) {
  const userId = await getSession();

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, companyId), eq(companies.userId, userId)),
  });
  if (!company) throw new Error("Unauthorized");

  await db.delete(memos).where(eq(memos.id, id));
  revalidatePath(`/companies/${companyId}`);
}
