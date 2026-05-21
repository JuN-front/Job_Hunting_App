import { NextResponse } from "next/server";
import { db } from "@/db";
import { companies, tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const allCompanies = await db.query.companies.findMany({
    where: eq(companies.userId, userId),
    with: { companyTags: { with: { tag: true } } },
    orderBy: (c, { asc }) => [asc(c.createdAt)],
  });

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });

  return NextResponse.json({ companies: allCompanies, tags: userTags });
}
