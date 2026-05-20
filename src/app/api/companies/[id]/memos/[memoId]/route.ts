import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { memos, companies } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; memoId: string }> }
) {
  const { id, memoId } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, id), eq(companies.userId, userId)),
  });
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const memo = await db.query.memos.findFirst({
    where: and(eq(memos.id, memoId), eq(memos.companyId, id)),
  });
  if (!memo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ memo, company });
}
