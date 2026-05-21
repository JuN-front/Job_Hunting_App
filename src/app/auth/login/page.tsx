"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

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
  const router = useRouter();
  const resetSuccess = searchParams.get("reset") === "success";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();

    // (ii) 両方未入力
    if (!email && !password) {
      setError("メールアドレスとパスワードは必須です");
      return;
    }
    // (iii) どちらかだけ未入力
    if (!email || !password) {
      setError("メールアドレスとパスワードは両方入力してください");
      return;
    }

    setLoading(true);

    try {
      const { signIn } = await import("next-auth/react");
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        // (iv) 認証失敗
        setError("メールアドレスまたはパスワードが違います");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("ログインに失敗しました。もう一度お試しください");
    } finally {
      setLoading(false);
    }
  }

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
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
              fontSize: "13px", color: "var(--red)",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>
                メールアドレス
              </label>
              <input
                name="email"
                type="email"
                placeholder="you@example.com"
                style={{
                  width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                  borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>
                パスワード
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                style={{
                  width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                  borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "10px", borderRadius: "8px", border: "none",
                background: loading ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
                color: "white", fontSize: "13px", fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer", marginTop: "4px",
              }}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </div>

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
