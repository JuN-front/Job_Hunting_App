import { db } from "@/db";
import { companies, tags } from "@/db/schema";
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

type Props = {
  searchParams: Promise<{ status?: string; tagId?: string; q?: string }>;
};

export default async function CompaniesPage({ searchParams }: Props) {
  const { status, tagId, q } = await searchParams;
  const session = await auth();
  const userId = session!.user.id;

  const allCompanies = await db.query.companies.findMany({
    where: eq(companies.userId, userId),
    with: { companyTags: { with: { tag: true } } },
    orderBy: (c, { desc }) => [desc(c.updatedAt)],
  });

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });

  const filtered = allCompanies.filter((c) => {
    if (status && c.status !== status) return false;
    if (tagId && !c.companyTags.some((ct) => ct.tagId === tagId)) return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.5px" }}>企業一覧</h1>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>{filtered.length} 社表示中</p>
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

      {/* フィルタ */}
      <div style={{
        background: "var(--bg-2)", border: "1px solid var(--border)",
        borderRadius: "10px", padding: "14px 16px", marginBottom: "16px",
      }}>
        <form style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <input name="q" defaultValue={q} placeholder="企業名で検索..." style={{
            flex: "1", minWidth: "160px", background: "var(--bg-3)", border: "1px solid var(--border-2)",
            borderRadius: "7px", padding: "7px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
          }} />
          <select name="status" defaultValue={status ?? ""} style={{
            background: "var(--bg-3)", border: "1px solid var(--border-2)",
            borderRadius: "7px", padding: "7px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
          }}>
            <option value="">すべてのステータス</option>
            {COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select name="tagId" defaultValue={tagId ?? ""} style={{
            background: "var(--bg-3)", border: "1px solid var(--border-2)",
            borderRadius: "7px", padding: "7px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
          }}>
            <option value="">すべてのタグ</option>
            {userTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button type="submit" style={{
            padding: "7px 16px", borderRadius: "7px", border: "1px solid var(--border-2)",
            background: "var(--bg-4)", color: "var(--text)", fontSize: "13px", cursor: "pointer",
          }}>絞り込む</button>
          <Link href="/companies" style={{ fontSize: "13px", color: "var(--text-3)", textDecoration: "none" }}>リセット</Link>
        </form>
      </div>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px", color: "var(--text-3)", fontSize: "13px" }}>
          条件に一致する企業はありません
        </div>
      ) : (
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          {filtered.map((company, i) => {
            const cfg = statusConfig[company.status];
            return (
              <Link key={company.id} href={`/companies/${company.id}`} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "13px 18px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                textDecoration: "none", transition: "background 0.15s",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)" }}>{company.name}</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap", alignItems: "center" }}>
                    {company.industry && <span style={{ fontSize: "11px", color: "var(--text-3)" }}>{company.industry}</span>}
                    {company.companyTags.map(({ tag }) => (
                      <span key={tag.id} style={{
                        fontSize: "11px", fontWeight: "500", padding: "1px 7px", borderRadius: "20px",
                        color: tag.color, background: tag.color + "22",
                      }}>{tag.name}</span>
                    ))}
                  </div>
                </div>
                <span style={{
                  fontSize: "11px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px",
                  color: cfg.color, background: cfg.bg, whiteSpace: "nowrap",
                }}>{company.status}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
