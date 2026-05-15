"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "⬡" },
  { href: "/companies", label: "企業一覧", icon: "◈" },
  { href: "/tags", label: "タグ管理", icon: "◇" },
  { href: "/settings", label: "設定", icon: "⚙" },
];

type Props = {
  user: { name?: string | null; email?: string | null; logoBase64?: string | null };
};

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();

  return (
    <aside style={{
      width: "220px", background: "var(--bg-2)", borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column", flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px", overflow: "hidden", flexShrink: 0,
            background: user.logoBase64 ? "transparent" : "linear-gradient(135deg, var(--accent), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {user.logoBase64
              ? <img src={user.logoBase64} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "14px", fontWeight: "700", color: "white" }}>J</span>
            }
          </div>
          <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", letterSpacing: "-0.3px" }}>
            ジョブカン
          </span>
        </div>
        <p style={{ fontSize: "11px", color: "var(--text-3)", marginLeft: "36px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user.email}
        </p>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "8px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "7px 10px", borderRadius: "7px", marginBottom: "2px",
              fontSize: "13px", fontWeight: isActive ? "500" : "400",
              color: isActive ? "var(--text)" : "var(--text-2)",
              background: isActive ? "var(--bg-4)" : "transparent",
              textDecoration: "none", transition: "all 0.15s",
            }}>
              <span style={{ fontSize: "14px", opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
              {item.label}
              {isActive && <span style={{ marginLeft: "auto", width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)" }} />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{ padding: "8px", borderTop: "1px solid var(--border)" }}>
        <form action={logout}>
          <button type="submit" style={{
            width: "100%", display: "flex", alignItems: "center", gap: "8px",
            padding: "7px 10px", borderRadius: "7px", fontSize: "13px",
            color: "var(--text-3)", background: "none", border: "none", cursor: "pointer",
          }}>
            <span style={{ fontSize: "14px" }}>↪</span> ログアウト
          </button>
        </form>
      </div>
    </aside>
  );
}
