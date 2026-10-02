"use server";

import { db } from "@/db";
import { jobSiteAccounts } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createJobSiteAccount(formData: FormData) {
  const userId = await getSession();
  const siteName = formData.get("siteName") as string;
  if (!siteName) throw new Error("サイト名は必須です");

  await db.insert(jobSiteAccounts).values({
    userId,
    siteName,
    siteUrl: (formData.get("siteUrl") as string) || null,
    loginId: (formData.get("loginId") as string) || null,
    password: (formData.get("password") as string) || null,
    notes: (formData.get("notes") as string) || null,
  });

  revalidatePath("/job-sites");
}

export async function updateJobSiteAccount(id: string, formData: FormData) {
  const userId = await getSession();
  const siteName = formData.get("siteName") as string;
  if (!siteName) throw new Error("サイト名は必須です");

  await db.update(jobSiteAccounts)
    .set({
      siteName,
      siteUrl: (formData.get("siteUrl") as string) || null,
      loginId: (formData.get("loginId") as string) || null,
      password: (formData.get("password") as string) || null,
      notes: (formData.get("notes") as string) || null,
      updatedAt: new Date(),
    })
    .where(and(eq(jobSiteAccounts.id, id), eq(jobSiteAccounts.userId, userId)));

  revalidatePath("/job-sites");
}

export async function deleteJobSiteAccount(id: string) {
  const userId = await getSession();
  await db.delete(jobSiteAccounts)
    .where(and(eq(jobSiteAccounts.id, id), eq(jobSiteAccounts.userId, userId)));
  revalidatePath("/job-sites");
}