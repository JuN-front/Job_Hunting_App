import { NextResponse } from "next/server";
import { db } from "@/db";
import { tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, session.user.id) });
  return NextResponse.json({ tags: userTags });
}
