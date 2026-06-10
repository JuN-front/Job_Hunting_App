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
  return session.user.id;
}

function str(formData: FormData, key: string) {
  return (formData.get(key) as string) || null;
}

function extractCompanyFields(formData: FormData) {
  const eventDateRaw = formData.get("eventDate") as string;
  return {
    name: formData.get("name") as string,
    status: (formData.get("status") as CompanyStatus) ?? "説明会",
    status2: (formData.get("status2") as CompanyStatus) || null,
    industry: str(formData, "industry"),
    url: str(formData, "url"),
    recruitUrl: str(formData, "recruitUrl"),
    mypageUrl: str(formData, "mypageUrl"),
    mypageId: str(formData, "mypageId"),
    mypagePassword: str(formData, "mypagePassword"),
    company3c: str(formData, "company3c"),
    swotStrength: str(formData, "swotStrength"),
    swotWeakness: str(formData, "swotWeakness"),
    swotOpportunity: str(formData, "swotOpportunity"),
    swotThreat: str(formData, "swotThreat"),
    // VMV
    vision: str(formData, "vision"),
    mission: str(formData, "mission"),
    companyValue: str(formData, "companyValue"),
    customers: str(formData, "customers"),
    competitors: str(formData, "competitors"),
    notes: str(formData, "notes"),
    eventDate: eventDateRaw ? new Date(eventDateRaw) : null,
  };
}

export async function createCompany(formData: FormData) {
  const userId = await getSession();
  const fields = extractCompanyFields(formData);
  if (!fields.name) throw new Error("企業名は必須です");

  const [company] = await db.insert(companies).values({ userId, ...fields }).returning();

  const tagIds = formData.getAll("tagIds") as string[];
  if (tagIds.length > 0) {
    await db.insert(companyTags).values(tagIds.map(tagId => ({ companyId: company.id, tagId })));
  }

  revalidatePath("/companies");
  redirect(`/companies/${company.id}`);
}

export async function updateCompany(id: string, formData: FormData) {
  const userId = await getSession();
  const fields = extractCompanyFields(formData);

  await db.update(companies)
    .set({ ...fields, updatedAt: new Date() })
    .where(and(eq(companies.id, id), eq(companies.userId, userId)));

  await db.delete(companyTags).where(eq(companyTags.companyId, id));
  const tagIds = formData.getAll("tagIds") as string[];
  if (tagIds.length > 0) {
    await db.insert(companyTags).values(tagIds.map(tagId => ({ companyId: id, tagId })));
  }

  revalidatePath(`/companies/${id}`);
  revalidatePath("/companies");
}

export async function updateCompanyStatus(id: string, status: CompanyStatus) {
  const userId = await getSession();
  await db.update(companies)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(companies.id, id), eq(companies.userId, userId)));

  revalidatePath(`/companies/${id}`);
  revalidatePath("/companies");
}

export async function deleteCompany(id: string) {
  const userId = await getSession();
  await db.delete(companies).where(and(eq(companies.id, id), eq(companies.userId, userId)));
  revalidatePath("/companies");
  redirect("/companies");
}
