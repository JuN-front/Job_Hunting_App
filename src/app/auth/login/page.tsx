import { login } from "@/actions/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--bg)", padding: "24px",
      backgroundImage: "radial-gradient(ellipse at 60% 20%, rgba(124,106,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(34,211,238,0.08) 0%, transparent 50%)",
    }}>
      <div style={{ width: "100%", maxWidth: "360px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "44px", height: "44px", borderRadius: "12px", margin: "0 auto 12px",
            background: "linear-gradient(135deg, var(--accent), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "20px", fontWeight: "700", color: "white",
          }}>J</div>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            おかえりなさい
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>就活トラッカーにログイン</p>
        </div>

        {/* Card */}
        <div style={{
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: "16px", padding: "28px",
        }}>
          <form action={login} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px", letterSpacing: "0.3px" }}>
                メールアドレス
              </label>
              <input name="email" type="email" required placeholder="you@example.com" style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)",
                outline: "none", transition: "border-color 0.15s",
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border-2)"}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px", letterSpacing: "0.3px" }}>
                パスワード
              </label>
              <input name="password" type="password" required placeholder="••••••••" style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)",
                outline: "none", transition: "border-color 0.15s",
              }}
              onFocus={e => (e.target as HTMLInputElement).style.borderColor = "var(--accent)"}
              onBlur={e => (e.target as HTMLInputElement).style.borderColor = "var(--border-2)"}
              />
            </div>
            <button type="submit" style={{
              width: "100%", padding: "10px", borderRadius: "8px", border: "none",
              background: "linear-gradient(135deg, var(--accent), #6457e8)",
              color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
              marginTop: "4px", transition: "opacity 0.15s",
            }}>
              ログイン
            </button>
          </form>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-3)", marginTop: "20px" }}>
          アカウントをお持ちでない方は{" "}
          <Link href="/auth/register" style={{ color: "var(--accent-2)", textDecoration: "none" }}>
            新規登録
          </Link>
        </p>
      </div>
    </div>
  );
}
