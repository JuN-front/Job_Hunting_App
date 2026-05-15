import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ジョブカン",
  description: "就職活動の進捗を一元管理",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  let logoBase64: string | null = null;
  if (session?.user?.id) {
    const user = await db.query.users.findFirst({ where: eq(users.id, session.user.id) });
    logoBase64 = user?.logoBase64 ?? null;
  }

  return (
    <html lang="ja">
      <body>
        {session?.user ? (
          <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
            <Sidebar user={{ name: session.user.name, email: session.user.email, logoBase64 }} />
            <main style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>{children}</main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
