import type { Metadata } from "next";
import "./globals.css";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "就活トラッカー",
  description: "就職活動の進捗を一元管理",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="ja">
      <body>
        {session?.user ? (
          <div style={{ display: "flex", height: "100vh", background: "var(--bg)", overflow: "hidden" }}>
            <Sidebar user={{ name: session.user.name, email: session.user.email }} />
            <main style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
              {children}
            </main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
