"use server";

import { db } from "@/db";
import { companies, companyTags } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { CompanyStatus } from "@/db/schema";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id as string;
}

export async function createCompany(formData: FormData) {
  const userId = await getSession();

  const name = formData.get("name") as string;
  const status = (formData.get("status") as CompanyStatus) ?? "説明会";
  const industry = (formData.get("industry") as string) || null;
  const url = (formData.get("url") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!name) throw new Error("企業名は必須です");

  const [company] = await db
    .insert(companies)
    .values({ userId, name, status, industry, url, notes })
    .returning();

  const tagIds = formData.getAll("tagIds") as string[];
  if (tagIds.length > 0) {
    await db.insert(companyTags).values(
      tagIds.map((tagId) => ({ companyId: company.id, tagId }))
    );
  }

  revalidatePath("/companies");
  redirect(`/companies/${company.id}`);
}

export async function updateCompany(id: string, formData: FormData) {
  const userId = await getSession();

  const name = formData.get("name") as string;
  const status = formData.get("status") as CompanyStatus;
  const industry = (formData.get("industry") as string) || null;
  const url = (formData.get("url") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  await db
    .update(companies)
    .set({ name, status, industry, url, notes, updatedAt: new Date() })
    .where(and(eq(companies.id, id), eq(companies.userId, userId)));

  await db.delete(companyTags).where(eq(companyTags.companyId, id));
  const tagIds = formData.getAll("tagIds") as string[];
  if (tagIds.length > 0) {
    await db.insert(companyTags).values(
      tagIds.map((tagId) => ({ companyId: id, tagId }))
    );
  }

  revalidatePath(`/companies/${id}`);
  revalidatePath("/companies");
}

export async function updateCompanyStatus(id: string, status: CompanyStatus) {
  const userId = await getSession();

  await db
    .update(companies)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(companies.id, id), eq(companies.userId, userId)));

  revalidatePath(`/companies/${id}`);
  revalidatePath("/companies");
}

export async function deleteCompany(id: string) {
  const userId = await getSession();

  await db
    .delete(companies)
    .where(and(eq(companies.id, id), eq(companies.userId, userId)));

  revalidatePath("/companies");
  redirect("/companies");
}
