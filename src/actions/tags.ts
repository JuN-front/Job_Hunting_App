"use server";

import { db } from "@/db";
import { tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

async function getSession() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createTag(formData: FormData) {
  const userId = await getSession();
  const name = formData.get("name") as string;
  const color = (formData.get("color") as string) ?? "#3b82f6";

  if (!name) throw new Error("タグ名は必須です");

  await db.insert(tags).values({ userId, name, color });
  revalidatePath("/tags");
}

export async function updateTag(id: string, formData: FormData) {
  const userId = await getSession();
  const name = formData.get("name") as string;
  const color = formData.get("color") as string;

  await db
    .update(tags)
    .set({ name, color })
    .where(and(eq(tags.id, id), eq(tags.userId, userId)));

  revalidatePath("/tags");
  revalidatePath("/companies");
}

export async function deleteTag(id: string) {
  const userId = await getSession();

  await db
    .delete(tags)
    .where(and(eq(tags.id, id), eq(tags.userId, userId)));

  revalidatePath("/tags");
  revalidatePath("/companies");
}
