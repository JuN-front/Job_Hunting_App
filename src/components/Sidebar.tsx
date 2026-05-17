"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";

const navItems = [
  { href: "/", label: "ダッシュボード", icon: "⬡" },
  { href: "/companies", label: "企業一覧", icon: "◈" },
  { href: "/tags", label: "タグ管理", icon: "◇" },
  { href: "/settings", label: "設定", icon: "⚙" },
];

const LogoIcon = () => (
  <svg width="26" height="26" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="52" height="52" rx="14" fill="#1a1d24"/>
    <circle cx="26" cy="26" r="14" fill="none" stroke="#7c6af7" strokeWidth="1.5" opacity="0.35"/>
    <circle cx="26" cy="26" r="9.5" fill="none" stroke="#7c6af7" strokeWidth="1.5" opacity="0.6"/>
    <circle cx="26" cy="26" r="5" fill="#7c6af7"/>
    <circle cx="26" cy="26" r="1.8" fill="white"/>
    <line x1="29" y1="23" x2="38" y2="14" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="34,14 38,14 38,18" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

type Props = {
  user: { name?: string | null; email?: string | null; logoBase64?: string | null };
};

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* サイドバー本体 */}
      <aside style={{
        width: open ? "220px" : "0px",
        minWidth: open ? "220px" : "0px",
        background: "var(--bg-2)",
        borderRight: open ? "1px solid var(--border)" : "none",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        overflow: "hidden",
        transition: "width 0.25s ease, min-width 0.25s ease",
        position: "relative",
      }}>
        {/* 中身（幅が0になっても内容が見えないようにwhiteSpace: nowrap） */}
        <div style={{ width: "220px", display: "flex", flexDirection: "column", height: "100%" }}>
          {/* Logo */}
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
              <div style={{
                width: "28px", height: "28px", borderRadius: "7px", overflow: "hidden", flexShrink: 0,
                background: user.logoBase64 ? "transparent" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {user.logoBase64
                  ? <img src={user.logoBase64} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "7px" }} />
                  : <LogoIcon />
                }
              </div>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "var(--text)", letterSpacing: "-0.3px", whiteSpace: "nowrap" }}>
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
                  whiteSpace: "nowrap",
                }}>
                  <span style={{ fontSize: "14px", opacity: isActive ? 1 : 0.6, flexShrink: 0 }}>{item.icon}</span>
                  {item.label}
                  {isActive && <span style={{ marginLeft: "auto", width: "5px", height: "5px", borderRadius: "50%", background: "var(--accent)", flexShrink: 0 }} />}
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
                whiteSpace: "nowrap",
              }}>
                <span style={{ fontSize: "14px", flexShrink: 0 }}>↪</span> ログアウト
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* トグルボタン（サイドバーの外側に常に表示） */}
      <button
        onClick={() => setOpen(o => !o)}
        title={open ? "サイドバーを閉じる" : "サイドバーを開く"}
        style={{
          position: "fixed",
          top: "50%",
          left: open ? "220px" : "0px",
          transform: "translateY(-50%)",
          zIndex: 50,
          width: "18px",
          height: "48px",
          background: "var(--bg-3)",
          border: "1px solid var(--border-2)",
          borderLeft: open ? "1px solid var(--border-2)" : "none",
          borderRadius: open ? "0 6px 6px 0" : "0 6px 6px 0",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--text-3)",
          fontSize: "10px",
          transition: "left 0.25s ease",
          padding: 0,
        }}
      >
        {open ? "‹" : "›"}
      </button>
    </>
  );
}
