"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth, signIn, signOut } from "@/auth";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
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

export async function deleteAccount() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  await db.delete(users).where(eq(users.id, userId));
  await signOut({ redirectTo: "/auth/login" });
}

export async function updateLogo(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id;
  const logoBase64 = formData.get("logoBase64") as string;
  await db.update(users).set({ logoBase64 }).where(eq(users.id, userId));
}

// メールアドレスの存在確認（パスワードリセット用）
export async function checkEmailExists(formData: FormData): Promise<{ exists: boolean }> {
  const email = formData.get("email") as string;
  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  return { exists: !!user };
}

// パスワードリセット
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirm = formData.get("confirm") as string;

  if (!email || !password) throw new Error("入力が不完全です");
  if (password !== confirm) throw new Error("パスワードが一致しません");
  if (password.length < 8) throw new Error("パスワードは8文字以上にしてください");

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  if (!user) throw new Error("このメールアドレスのアカウントが見つかりません");

  const passwordHash = await bcrypt.hash(password, 12);
  await db.update(users).set({ passwordHash }).where(eq(users.id, user.id));

  redirect("/auth/login?reset=success");
}
