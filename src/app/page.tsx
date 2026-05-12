import { db } from "@/db";
import { companies } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { COMPANY_STATUSES } from "@/db/schema";

const statusConfig: Record<string, { color: string; bg: string }> = {
  説明会:   { color: "#9399a8", bg: "rgba(147,153,168,0.12)" },
  ES提出:   { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  一次面接: { color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  二次面接: { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  最終面接: { color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  内定:     { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  入社予定: { color: "#34d399", bg: "rgba(52,211,153,0.2)" },
  辞退:     { color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  不合格:   { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const allCompanies = await db.query.companies.findMany({
    where: eq(companies.userId, userId),
    orderBy: (c, { desc }) => [desc(c.updatedAt)],
  });

  const recent = allCompanies.slice(0, 8);
  const activeCount = allCompanies.filter(c => !["内定", "辞退", "不合格", "入社予定"].includes(c.status)).length;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.5px" }}>
            ダッシュボード
          </h1>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
            {allCompanies.length} 社を管理中 · 選考中 {activeCount} 社
          </p>
        </div>
        <Link href="/companies/new" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 16px", borderRadius: "8px", border: "none",
          background: "linear-gradient(135deg, var(--accent), #6457e8)",
          color: "white", fontSize: "13px", fontWeight: "600",
          textDecoration: "none", transition: "opacity 0.15s",
        }}>
          <span style={{ fontSize: "16px", lineHeight: 1 }}>+</span> 企業を追加
        </Link>
      </div>

      {/* Status Grid */}
      <section style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
          選考状況
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
          {COMPANY_STATUSES.map((status) => {
            const count = allCompanies.filter(c => c.status === status).length;
            const cfg = statusConfig[status];
            return (
              <Link key={status} href={`/companies?status=${encodeURIComponent(status)}`} style={{
                display: "block", padding: "14px 16px",
                background: "var(--bg-2)", border: "1px solid var(--border)",
                borderRadius: "10px", textDecoration: "none", transition: "border-color 0.15s",
              }}>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)", lineHeight: 1, marginBottom: "6px" }}>
                  {count}
                </div>
                <div style={{
                  display: "inline-block", fontSize: "11px", fontWeight: "500",
                  padding: "2px 8px", borderRadius: "20px",
                  color: cfg.color, background: cfg.bg,
                }}>
                  {status}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>
          最近更新した企業
        </p>
        {recent.length === 0 ? (
          <div style={{
            background: "var(--bg-2)", border: "1px dashed var(--border-2)",
            borderRadius: "12px", padding: "48px", textAlign: "center",
          }}>
            <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "12px" }}>まだ企業が登録されていません</p>
            <Link href="/companies/new" style={{ fontSize: "13px", color: "var(--accent-2)", textDecoration: "none" }}>
              最初の企業を追加する →
            </Link>
          </div>
        ) : (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {recent.map((company, i) => {
              const cfg = statusConfig[company.status];
              return (
                <Link key={company.id} href={`/companies/${company.id}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 18px", textDecoration: "none",
                  borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none",
                  transition: "background 0.15s",
                }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)" }}>{company.name}</div>
                    {company.industry && <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>{company.industry}</div>}
                  </div>
                  <span style={{
                    fontSize: "11px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px",
                    color: cfg.color, background: cfg.bg, whiteSpace: "nowrap",
                  }}>
                    {company.status}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
