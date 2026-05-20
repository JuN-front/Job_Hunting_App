import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { companies, tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, id), eq(companies.userId, userId)),
    with: { companyTags: true },
  });
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });
  const currentTagIds = company.companyTags.map((ct: any) => ct.tagId);

  return NextResponse.json({ company, userTags, currentTagIds });
}
