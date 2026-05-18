"use client";

import { useState } from "react";
import { resetPassword } from "@/actions/auth";
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

type Step = "email" | "password";

export default function ResetPasswordPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step1: メールアドレス確認
  async function handleEmailSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.get("email") }),
      });
      const data = await res.json();

      if (!data.exists) {
        setError("このメールアドレスのアカウントが見つかりません");
      } else {
        setEmail(formData.get("email") as string);
        setStep("password");
      }
    } catch {
      setError("エラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  }

  // Step2: 新パスワード設定
  async function handlePasswordSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password.length < 8) {
      setError("パスワードは8文字以上にしてください");
      setLoading(false);
      return;
    }
    if (password !== confirm) {
      setError("パスワードが一致しません");
      setLoading(false);
      return;
    }

    formData.append("email", email);

    try {
      await resetPassword(formData);
    } catch (err: any) {
      // redirect()はthrowされるので正常ケースはここに来ない
      setError(err.message ?? "エラーが発生しました");
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
        {/* ロゴ */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "14px" }}>
            <LogoIcon />
          </div>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "var(--text)", margin: "0 0 2px", letterSpacing: "-0.5px" }}>
            ジョブカン
          </h1>
          <p style={{ fontSize: "11px", color: "var(--text-3)", margin: "0 0 6px", letterSpacing: "2px" }}>JOB HUNTING TRACKER</p>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
            {step === "email" ? "パスワードの再設定" : "新しいパスワードを設定"}
          </p>
        </div>

        {/* ステップインジケーター */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "20px", justifyContent: "center" }}>
          {["メール確認", "パスワード設定"].map((label, i) => {
            const current = step === "email" ? 0 : 1;
            const done = i < current;
            const active = i === current;
            return (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{
                    width: "22px", height: "22px", borderRadius: "50%", fontSize: "11px", fontWeight: "600",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    background: done ? "var(--green)" : active ? "var(--accent)" : "var(--bg-4)",
                    color: done || active ? "white" : "var(--text-3)",
                    transition: "all 0.2s",
                  }}>{done ? "✓" : i + 1}</div>
                  <span style={{ fontSize: "11px", color: active ? "var(--text)" : "var(--text-3)", fontWeight: active ? "500" : "400" }}>
                    {label}
                  </span>
                </div>
                {i < 1 && <div style={{ width: "24px", height: "1px", background: done ? "var(--green)" : "var(--border-2)" }} />}
              </div>
            );
          })}
        </div>

        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "16px", padding: "28px" }}>

          {/* エラー表示 */}
          {error && (
            <div style={{
              background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
              borderRadius: "8px", padding: "10px 14px", marginBottom: "16px",
              fontSize: "13px", color: "var(--red)",
            }}>
              {error}
            </div>
          )}

          {/* Step 1: メールアドレス入力 */}
          {step === "email" && (
            <form onSubmit={handleEmailSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
                登録したメールアドレスを入力してください。
              </p>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>
                  メールアドレス
                </label>
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  style={{
                    width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                    borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
                  }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "10px", borderRadius: "8px", border: "none",
                background: loading ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
                color: "white", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "確認中..." : "次へ →"}
              </button>
            </form>
          )}

          {/* Step 2: 新パスワード入力 */}
          {step === "password" && (
            <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{
                background: "var(--bg-3)", borderRadius: "8px", padding: "10px 14px",
                fontSize: "12px", color: "var(--text-2)",
              }}>
                📧 {email}
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>
                  新しいパスワード
                </label>
                <input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder="8文字以上"
                  style={{
                    width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                    borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>
                  パスワード（確認用）
                </label>
                <input
                  name="confirm"
                  type="password"
                  required
                  placeholder="もう一度入力"
                  style={{
                    width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                    borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
                  }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "10px", borderRadius: "8px", border: "none",
                background: loading ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
                color: "white", fontSize: "13px", fontWeight: "600", cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading ? "更新中..." : "パスワードを更新する"}
              </button>
              <button type="button" onClick={() => { setStep("email"); setError(""); }} style={{
                background: "none", border: "none", color: "var(--text-3)", fontSize: "12px",
                cursor: "pointer", textAlign: "center",
              }}>
                ← メールアドレスを変更する
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-3)", marginTop: "20px" }}>
          <Link href="/auth/login" style={{ color: "var(--accent-2)", textDecoration: "none" }}>
            ← ログイン画面に戻る
          </Link>
        </p>
      </div>
    </div>
  );
}
