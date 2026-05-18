import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) return NextResponse.json({ exists: false });

  const user = await db.query.users.findFirst({ where: eq(users.email, email) });
  return NextResponse.json({ exists: !!user });
}
