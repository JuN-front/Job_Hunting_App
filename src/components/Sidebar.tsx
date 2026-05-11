"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "📊" },
  { href: "/companies", label: "企業一覧", icon: "🏢" },
  { href: "/tags", label: "タグ管理", icon: "🏷️" },
];

type Props = {
  user: { name?: string | null; email?: string | null };
};

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <h1 className="text-lg font-bold text-gray-900">就活管理</h1>
        <p className="text-xs text-gray-500 mt-0.5 truncate">{user.email}</p>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <form action={logout}>
          <button
            type="submit"
            className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <span>🚪</span> ログアウト
          </button>
        </form>
      </div>
    </aside>
  );
}
