import { NextResponse } from "next/server";
import { db } from "@/db";
import { jobSiteAccounts } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const accounts = await db.query.jobSiteAccounts.findMany({
    where: eq(jobSiteAccounts.userId, session.user.id),
    orderBy: (a, { asc }) => [asc(a.createdAt)],
  });

  return NextResponse.json({ accounts });
}