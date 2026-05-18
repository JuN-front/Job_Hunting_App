"use client";

import { login } from "@/actions/auth";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const LogoIcon = () => (
  <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="52" height="52" rx="14" fill="#13151a"/>
    <circle cx="26" cy="26" r="14" fill="none" stroke="#7c6af7" strokeWidth="1.5" opacity="0.35"/>
    <circle cx="26" cy="26" r="9.5" fill="none" stroke="#7c6af7" strokeWidth="1.5" opacity="0.6"/>
    <circle cx="26" cy="26" r="5" fill="#7c6af7"/>
    <circle cx="26" cy="26" r="1.8" fill="white"/>
    <line x1="29" y1="23" x2="38" y2="14" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
    <polyline points="34,14 38,14 38,18" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

function LoginContent() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "24px",
      backgroundImage: "radial-gradient(ellipse at 60% 20%, rgba(124,106,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(34,211,238,0.08) 0%, transparent 50%)",
    }}>
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
            <LogoIcon />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px", letterSpacing: "-0.5px" }}>
            ジョブカン
          </h1>
          <p style={{ fontSize: "11px", color: "var(--text-3)", margin: "0 0 4px", letterSpacing: "2px" }}>JOB HUNTING TRACKER</p>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>アカウントにログイン</p>
        </div>

        {resetSuccess && (
          <div style={{
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.3)",
            borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
            fontSize: "13px", color: "var(--green)", textAlign: "center",
          }}>
            ✅ パスワードを更新しました。新しいパスワードでログインしてください。
          </div>
        )}

        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "28px",
        }}>
          <form action={login} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>
                メールアドレス
              </label>
              <input name="email" type="email" required placeholder="you@example.com" style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
              }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>
                パスワード
              </label>
              <input name="password" type="password" required placeholder="••••••••" style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
              }} />
            </div>
            <button type="submit" style={{
              width: "100%", padding: "10px", borderRadius: "8px", border: "none",
              background: "linear-gradient(135deg, var(--accent), #6457e8)",
              color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "4px",
            }}>
              ログイン
            </button>
          </form>
        </div>

        {/* 新規登録・パスワードリセット */}
        <div style={{ textAlign: "center", marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <p style={{ fontSize: "12px", color: "var(--text-3)", margin: 0 }}>
            アカウントをお持ちでない方は{" "}
            <Link href="/auth/register" style={{ color: "var(--accent-2)", textDecoration: "none" }}>
              新規登録
            </Link>
          </p>
          <p style={{ fontSize: "12px", color: "var(--text-3)", margin: 0 }}>
            パスワードを忘れた方は{" "}
            <Link href="/auth/reset-password" style={{ color: "var(--accent-2)", textDecoration: "none" }}>
              こちら
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}
