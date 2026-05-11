import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "就活管理アプリ",
  description: "就職活動の進捗を一元管理",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="ja">
      <body className={inter.className}>
        {session?.user ? (
          <div className="flex h-screen bg-gray-50">
            <Sidebar user={{ name: session.user.name, email: session.user.email }} />
            <main className="flex-1 overflow-y-auto p-8">{children}</main>
          </div>
        ) : (
          <main>{children}</main>
        )}
      </body>
    </html>
  );
}
