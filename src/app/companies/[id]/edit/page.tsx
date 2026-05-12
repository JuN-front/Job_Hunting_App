import { db } from "@/db";
import { companies, tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateCompany } from "@/actions/companies";
import { COMPANY_STATUSES } from "@/db/schema";
import Link from "next/link";

const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
  borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
};
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px",
};
const sectionLabel: React.CSSProperties = {
  fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px",
  textTransform: "uppercase", marginBottom: "12px",
};

type Props = { params: Promise<{ id: string }> };

export default async function EditCompanyPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, id), eq(companies.userId, userId)),
    with: { companyTags: true },
  });
  if (!company) notFound();

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });
  const currentTagIds = company.companyTags.map(ct => ct.tagId);
  const action = updateCompany.bind(null, company.id);

  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <Link href={`/companies/${company.id}`} style={{ fontSize: "18px", color: "var(--text-3)", textDecoration: "none" }}>←</Link>
        <h1 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text)", margin: 0, letterSpacing: "-0.4px" }}>企業を編集</h1>
      </div>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* 基本情報 */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={sectionLabel}>基本情報</p>
          <div>
            <label style={labelStyle}>企業名 *</label>
            <input name="name" required defaultValue={company.name} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>選考ステータス</label>
            <select name="status" defaultValue={company.status} style={{ ...inputStyle, cursor: "pointer" }}>
              {COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>業界</label>
            <input name="industry" defaultValue={company.industry ?? ""} style={inputStyle} />
          </div>
          {userTags.length > 0 && (
            <div>
              <label style={labelStyle}>タグ</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {userTags.map(tag => (
                  <label key={tag.id} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={currentTagIds.includes(tag.id)} style={{ accentColor: tag.color }} />
                    <span style={{ fontSize: "12px", fontWeight: "500", padding: "2px 8px", borderRadius: "20px", color: tag.color, background: tag.color + "22" }}>
                      {tag.name}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* URL情報 */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={sectionLabel}>URL情報</p>
          <div>
            <label style={labelStyle}>公式URL</label>
            <input name="url" type="url" defaultValue={company.url ?? ""} placeholder="https://" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>新卒採用HP</label>
            <input name="recruitUrl" type="url" defaultValue={company.recruitUrl ?? ""} placeholder="https://" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>新卒採用マイページ</label>
            <input name="mypageUrl" type="url" defaultValue={company.mypageUrl ?? ""} placeholder="https://" style={inputStyle} />
          </div>
        </div>

        {/* 企業研究メモ */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <p style={sectionLabel}>企業研究メモ（任意）</p>
          <div>
            <label style={labelStyle}>強み</label>
            <textarea name="strengths" rows={2} defaultValue={company.strengths ?? ""} style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
          </div>
          <div>
            <label style={labelStyle}>顧客</label>
            <textarea name="customers" rows={2} defaultValue={company.customers ?? ""} style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
          </div>
          <div>
            <label style={labelStyle}>競合相手</label>
            <textarea name="competitors" rows={2} defaultValue={company.competitors ?? ""} style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
          </div>
          <div>
            <label style={labelStyle}>備考</label>
            <textarea name="notes" rows={2} defaultValue={company.notes ?? ""} style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
          </div>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{
            flex: 1, padding: "10px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, var(--accent), #6457e8)",
            color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>保存する</button>
          <Link href={`/companies/${company.id}`} style={{
            flex: 1, padding: "10px", borderRadius: "8px", textAlign: "center",
            border: "1px solid var(--border-2)", color: "var(--text-2)", fontSize: "13px",
            textDecoration: "none", background: "var(--bg-3)",
          }}>キャンセル</Link>
        </div>
      </form>
    </div>
  );
}
