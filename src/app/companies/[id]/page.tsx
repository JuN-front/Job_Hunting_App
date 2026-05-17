import { db } from "@/db";
import { companies } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteCompany, updateCompanyStatus } from "@/actions/companies";
import { COMPANY_STATUSES } from "@/db/schema";

const statusConfig: Record<string, { color: string; bg: string }> = {
  "説明会":   { color: "#9399a8", bg: "rgba(147,153,168,0.12)" },
  "IS参加":    { color: "#818cf8", bg: "rgba(129,140,248,0.12)" },
  "ES提出":              { color: "#60a5fa", bg: "rgba(96,165,250,0.12)" },
  "一次面接/カジュアル面談": { color: "#22d3ee", bg: "rgba(34,211,238,0.12)" },
  "二次面接":            { color: "#a78bfa", bg: "rgba(167,139,250,0.12)" },
  "三次面接以降":        { color: "#c084fc", bg: "rgba(192,132,252,0.12)" },
  "最終面接":            { color: "#f472b6", bg: "rgba(244,114,182,0.12)" },
  "内定":                { color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  "入社検討候補":        { color: "#34d399", bg: "rgba(52,211,153,0.2)" },
  "辞退":                { color: "#fb923c", bg: "rgba(251,146,60,0.12)" },
  "不合格":              { color: "#f87171", bg: "rgba(248,113,113,0.12)" },
};

type Props = { params: Promise<{ id: string }> };

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, id), eq(companies.userId, userId)),
    with: {
      companyTags: { with: { tag: true } },
      memos: { orderBy: (m, { desc }) => [desc(m.updatedAt)] },
    },
  });
  if (!company) notFound();

  const cfg = statusConfig[company.status] ?? { color: "#9399a8", bg: "rgba(147,153,168,0.12)" };

  return (
    <div style={{ maxWidth: "660px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <Link href="/companies" style={{ fontSize: "12px", color: "var(--text-3)", textDecoration: "none", display: "block", marginBottom: "8px" }}>← 企業一覧</Link>
          <h1 style={{ fontSize: "22px", fontWeight: "600", color: "var(--text)", margin: "0 0 8px", letterSpacing: "-0.4px" }}>{company.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            {company.industry && <span style={{ fontSize: "12px", color: "var(--text-3)" }}>{company.industry}</span>}
            {company.url && <a href={company.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "var(--accent-2)", textDecoration: "none" }}>公式サイト ↗</a>}
            {company.recruitUrl && <a href={company.recruitUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "var(--cyan)", textDecoration: "none" }}>採用HP ↗</a>}
            {company.mypageUrl && <a href={company.mypageUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: "12px", color: "var(--green)", textDecoration: "none" }}>マイページ ↗</a>}
            {company.mypageId && <span style={{ fontSize: "12px", color: "var(--text-3)" }}>ID: {company.mypageId}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
          <Link href={`/companies/${company.id}/edit`} style={{
            padding: "7px 14px", borderRadius: "7px", fontSize: "12px", fontWeight: "500",
            border: "1px solid var(--border-2)", color: "var(--text-2)", textDecoration: "none", background: "var(--bg-3)",
          }}>編集</Link>
          <form action={deleteCompany.bind(null, company.id)}>
            <button type="submit" style={{
              padding: "7px 14px", borderRadius: "7px", fontSize: "12px", fontWeight: "500",
              border: "1px solid rgba(248,113,113,0.3)", color: "var(--red)", background: "rgba(248,113,113,0.08)", cursor: "pointer",
            }}>削除</button>
          </form>
        </div>
      </div>

      {/* Status */}
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "18px 20px", marginBottom: "10px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" }}>選考ステータス</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
          {COMPANY_STATUSES.map(status => {
            const c = statusConfig[status] ?? { color: "#9399a8", bg: "rgba(147,153,168,0.12)" };
            const isActive = company.status === status;
            return (
              <form key={status} action={updateCompanyStatus.bind(null, company.id, status)}>
                <button type="submit" style={{
                  padding: "5px 12px", borderRadius: "20px", border: "1px solid",
                  fontSize: "12px", fontWeight: "500", cursor: "pointer", transition: "all 0.15s",
                  color: isActive ? c.color : "var(--text-3)",
                  background: isActive ? c.bg : "transparent",
                  borderColor: isActive ? c.color + "50" : "var(--border)",
                  transform: isActive ? "scale(1.03)" : "scale(1)",
                }}>{status}</button>
              </form>
            );
          })}
        </div>
      </div>

      {/* Tags */}
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "16px 20px", marginBottom: "10px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>タグ</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
          {company.companyTags.length === 0
            ? <span style={{ fontSize: "12px", color: "var(--text-3)" }}>タグなし</span>
            : company.companyTags.map(({ tag }) => (
              <span key={tag.id} style={{ fontSize: "12px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px", color: tag.color, background: tag.color + "22" }}>
                {tag.name}
              </span>
            ))
          }
          <Link href={`/companies/${company.id}/edit`} style={{ fontSize: "11px", color: "var(--text-3)", textDecoration: "none", marginLeft: "4px" }}>編集</Link>
        </div>
      </div>

      {/* 企業研究メモ */}
      {(company.strengths || company.customers || company.competitors) && (
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "18px 20px", marginBottom: "10px" }}>
          <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "14px" }}>企業研究メモ</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {company.strengths && (
              <div>
                <p style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "4px" }}>強み</p>
                <p style={{ fontSize: "13px", color: "var(--text-2)", whiteSpace: "pre-wrap", margin: 0 }}>{company.strengths}</p>
              </div>
            )}
            {company.customers && (
              <div>
                <p style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "4px" }}>顧客</p>
                <p style={{ fontSize: "13px", color: "var(--text-2)", whiteSpace: "pre-wrap", margin: 0 }}>{company.customers}</p>
              </div>
            )}
            {company.competitors && (
              <div>
                <p style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "4px" }}>競合相手</p>
                <p style={{ fontSize: "13px", color: "var(--text-2)", whiteSpace: "pre-wrap", margin: 0 }}>{company.competitors}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Memos */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "16px 0 10px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", margin: 0 }}>
          メモ <span style={{ fontWeight: "400" }}>({company.memos.length})</span>
        </p>
        <Link href={`/companies/${company.id}/memos/new`} style={{
          fontSize: "12px", fontWeight: "500", padding: "5px 12px", borderRadius: "7px",
          background: "var(--bg-4)", border: "1px solid var(--border-2)", color: "var(--text-2)", textDecoration: "none",
        }}>+ メモを追加</Link>
      </div>

      {company.memos.length === 0 ? (
        <div style={{ background: "var(--bg-2)", border: "1px dashed var(--border-2)", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "8px" }}>メモがまだありません</p>
          <Link href={`/companies/${company.id}/memos/new`} style={{ fontSize: "12px", color: "var(--accent-2)", textDecoration: "none" }}>最初のメモを作成 →</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {company.memos.map(memo => (
            <Link key={memo.id} href={`/companies/${company.id}/memos/${memo.id}`} style={{
              display: "block", background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "14px 18px", textDecoration: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)" }}>{memo.title}</span>
                <span style={{ fontSize: "11px", color: "var(--text-3)", background: "var(--bg-4)", padding: "2px 8px", borderRadius: "6px" }}>{memo.templateType}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-3)", margin: 0, whiteSpace: "pre-wrap", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                {memo.content || "（内容なし）"}
              </p>
            </Link>
          ))}
        </div>
      )}

      {company.notes && (
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", padding: "18px 20px", marginTop: "10px" }}>
          <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>備考</p>
          <p style={{ fontSize: "13px", color: "var(--text-2)", whiteSpace: "pre-wrap", margin: 0 }}>{company.notes}</p>
        </div>
      )}
    </div>
  );
}
