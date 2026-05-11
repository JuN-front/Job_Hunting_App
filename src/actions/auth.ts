"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { signIn, signOut } from "@/auth";
import { redirect } from "next/navigation";

export async function register(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if (!email || !password) throw new Error("メールとパスワードは必須です");

  const existing = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (existing) throw new Error("このメールアドレスは既に登録されています");

  const passwordHash = await bcrypt.hash(password, 12);
  await db.insert(users).values({ email, passwordHash, name });

  await signIn("credentials", { email, password, redirectTo: "/" });
}

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  await signIn("credentials", { email, password, redirectTo: "/" });
}

export async function logout() {
  await signOut({ redirectTo: "/auth/login" });
}
