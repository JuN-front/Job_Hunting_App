"use client";

import { register } from "@/actions/auth";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "24px",
      backgroundImage: "radial-gradient(ellipse at 60% 20%, rgba(124,106,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(34,211,238,0.08) 0%, transparent 50%)",
    }}>
      <div style={{ width: "100%", maxWidth: "360px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px", margin: "0 auto 12px",
            background: "linear-gradient(135deg, var(--accent), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", fontWeight: "700", color: "white",
          }}>J</div>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            アカウント作成
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>就活をもっとスマートに管理しよう</p>
        </div>

        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "28px",
        }}>
          <form action={register} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>お名前</label>
              <input name="name" type="text" placeholder="山田 太郎" style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
              }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>メールアドレス</label>
              <input name="email" type="email" required placeholder="you@example.com" style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
              }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>パスワード</label>
              <input name="password" type="password" required minLength={8} placeholder="8文字以上" style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
              }} />
            </div>
            <button type="submit" style={{
              width: "100%", padding: "10px", borderRadius: "8px", border: "none",
              background: "linear-gradient(135deg, var(--accent), #6457e8)",
              color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer", marginTop: "4px",
            }}>
              アカウントを作成
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-3)", marginTop: "20px" }}>
          すでにアカウントをお持ちの方は{" "}
          <Link href="/auth/login" style={{ color: "var(--accent-2)", textDecoration: "none" }}>ログイン</Link>
        </p>
      </div>
    </div>
  );
}
