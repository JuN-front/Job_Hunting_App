import { db } from "@/db";
import { companies } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { COMPANY_STATUSES } from "@/db/schema";
import { statusConfig, fallbackCfg } from "@/lib/statusConfig";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const allCompanies = await db.query.companies.findMany({
    where: eq(companies.userId, userId),
    orderBy: (c, { desc }) => [desc(c.updatedAt)],
  });

  const recent = allCompanies.slice(0, 8);
  const activeCount = allCompanies.filter(c =>
    !["内定", "辞退", "本選考不合格", "IS不合格", "入社検討候補"].includes(c.status)
  ).length;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.5px" }}>ダッシュボード</h1>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>
            {allCompanies.length} 社を管理中 · 選考中 {activeCount} 社
          </p>
        </div>
        <Link href="/companies/new" style={{
          display: "inline-flex", alignItems: "center", gap: "6px",
          padding: "8px 16px", borderRadius: "8px",
          background: "linear-gradient(135deg, var(--accent), #6457e8)",
          color: "white", fontSize: "13px", fontWeight: "600", textDecoration: "none",
        }}>
          <span>+</span> 企業を追加
        </Link>
      </div>

      {/* Status Grid */}
      <section style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>選考状況</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "8px" }}>
          {COMPANY_STATUSES.map(status => {
            const count = allCompanies.filter(c => c.status === status || c.status2 === status).length;
            const cfg = statusConfig[status] ?? fallbackCfg;
            return (
              <Link key={status} href={`/companies?status=${encodeURIComponent(status)}`} style={{
                display: "block", padding: "14px 16px",
                background: "var(--bg-2)", border: "1px solid var(--border)",
                borderRadius: "10px", textDecoration: "none",
              }}>
                <div style={{ fontSize: "22px", fontWeight: "700", color: "var(--text)", lineHeight: 1, marginBottom: "6px" }}>{count}</div>
                <div style={{
                  display: "inline-block", fontSize: "11px", fontWeight: "500",
                  padding: "2px 8px", borderRadius: "20px", color: cfg.color, background: cfg.bg,
                }}>{status}</div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Recent */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>最近更新した企業</p>
        {recent.length === 0 ? (
          <div style={{ background: "var(--bg-2)", border: "1px dashed var(--border-2)", borderRadius: "12px", padding: "48px", textAlign: "center" }}>
            <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "12px" }}>まだ企業が登録されていません</p>
            <Link href="/companies/new" style={{ fontSize: "13px", color: "var(--accent-2)", textDecoration: "none" }}>最初の企業を追加する →</Link>
          </div>
        ) : (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {recent.map((company, i) => {
              const cfg = statusConfig[company.status] ?? fallbackCfg;
              const cfg2 = company.status2 ? (statusConfig[company.status2] ?? fallbackCfg) : null;
              return (
                <Link key={company.id} href={`/companies/${company.id}`} style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "12px 18px", textDecoration: "none",
                  borderBottom: i < recent.length - 1 ? "1px solid var(--border)" : "none",
                }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)" }}>{company.name}</div>
                    <div style={{ display: "flex", gap: "6px", marginTop: "4px", alignItems: "center" }}>
                      {company.industry && <span style={{ fontSize: "11px", color: "var(--text-3)" }}>{company.industry}</span>}
                      {company.eventDate && (
                        <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                          📅 {new Date(company.eventDate).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                    <span style={{ fontSize: "11px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px", color: cfg.color, background: cfg.bg, whiteSpace: "nowrap" }}>
                      {company.status}
                    </span>
                    {cfg2 && company.status2 && (
                      <span style={{ fontSize: "11px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px", color: cfg2.color, background: cfg2.bg, whiteSpace: "nowrap" }}>
                        {company.status2}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
