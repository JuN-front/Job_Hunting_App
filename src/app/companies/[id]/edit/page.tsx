"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateCompany } from "@/actions/companies";
import { COMPANY_STATUSES } from "@/db/schema";
import Link from "next/link";
import { use } from "react";
import DatePicker from "@/components/DatePicker";

const inp: React.CSSProperties = { width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none" };
const lbl: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" };
const sec: React.CSSProperties = { fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" };
const card: React.CSSProperties = { background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" };
const ta: React.CSSProperties = { ...({} as any), resize: "none" as const, fontFamily: "inherit" };

type Props = { params: Promise<{ id: string }> };

export default function EditCompanyPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [company, setCompany] = useState<any>(null);
  const [userTags, setUserTags] = useState<any[]>([]);
  const [currentTagIds, setCurrentTagIds] = useState<string[]>([]);
  const submittingRef = useRef(false);

  useEffect(() => {
    fetch(`/api/companies/${id}`)
      .then(r => r.json())
      .then(d => { setCompany(d.company); setUserTags(d.userTags); setCurrentTagIds(d.currentTagIds); });
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSaving(true);
    try {
      await updateCompany(id, new FormData(e.currentTarget));
      router.push(`/companies/${id}`);
      router.refresh();
    } catch {
      setSaving(false);
      submittingRef.current = false;
    }
  }

  if (!company) return <div style={{ color: "var(--text-3)", fontSize: "13px", padding: "40px" }}>読み込み中...</div>;

  const eventDateValue = company.eventDate ? new Date(company.eventDate).toISOString().split("T")[0] : "";

  const taStyle = (rows: number): React.CSSProperties => ({ ...inp, ...ta, height: `${rows * 24 + 18}px` });

  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <Link href={`/companies/${id}`} style={{ fontSize: "18px", color: "var(--text-3)", textDecoration: "none" }}>←</Link>
        <h1 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text)", margin: 0, letterSpacing: "-0.4px" }}>企業を編集</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* 基本情報 */}
        <div style={card}>
          <p style={sec}>基本情報</p>
          <div><label style={lbl}>企業名 *</label><input name="name" required defaultValue={company.name} style={inp} /></div>
          <div>
            <label style={lbl}>選考ステータス①</label>
            <select name="status" defaultValue={company.status} style={{ ...inp, cursor: "pointer" }}>{COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div>
            <label style={lbl}>選考ステータス② <span style={{ color: "var(--text-3)", fontWeight: 400 }}>（任意）</span></label>
            <select name="status2" defaultValue={company.status2 ?? ""} style={{ ...inp, cursor: "pointer" }}><option value="">なし</option>{COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div><label style={lbl}>日付 <span style={{ color: "var(--text-3)", fontWeight: 400 }}>（任意）</span></label><DatePicker name="eventDate" defaultValue={eventDateValue} /></div>
          <div><label style={lbl}>業界</label><input name="industry" defaultValue={company.industry ?? ""} style={inp} /></div>
          {userTags.length > 0 && (
            <div>
              <label style={lbl}>タグ</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {userTags.map((tag: any) => (
                  <label key={tag.id} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input type="checkbox" name="tagIds" value={tag.id} defaultChecked={currentTagIds.includes(tag.id)} style={{ accentColor: tag.color }} />
                    <span style={{ fontSize: "12px", fontWeight: "500", padding: "2px 8px", borderRadius: "20px", color: tag.color, background: tag.color + "22" }}>{tag.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* URL・マイページ */}
        <div style={card}>
          <p style={sec}>URL・マイページ情報</p>
          <div><label style={lbl}>公式URL</label><input name="url" type="url" defaultValue={company.url ?? ""} placeholder="https://" style={inp} /></div>
          <div><label style={lbl}>新卒採用HP</label><input name="recruitUrl" type="url" defaultValue={company.recruitUrl ?? ""} placeholder="https://" style={inp} /></div>
          <div><label style={lbl}>新卒採用マイページ URL</label><input name="mypageUrl" type="url" defaultValue={company.mypageUrl ?? ""} placeholder="https://" style={inp} /></div>
          <div><label style={lbl}>マイページ ID</label><input name="mypageId" defaultValue={company.mypageId ?? ""} style={inp} /></div>
          <div>
            <label style={lbl}>マイページ パスワード（メモ）</label>
            <input name="mypagePassword" type="text" defaultValue={company.mypagePassword ?? ""} style={inp} />
            <p style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "4px" }}>※ 暗号化されずに保存されます。取り扱いにご注意ください。</p>
          </div>
        </div>

        {/* 3C分析 */}
        <div style={card}>
          <p style={sec}>3C分析（任意）</p>
          <div><label style={lbl}>Company（自社・企業の特徴）</label><textarea name="company3c" defaultValue={company.company3c ?? ""} placeholder="例: 国内シェアNo.1..." style={taStyle(3)} /></div>
          <div><label style={lbl}>Customer（顧客・市場）</label><textarea name="customers" defaultValue={company.customers ?? ""} placeholder="例: 大手製造業..." style={taStyle(3)} /></div>
          <div><label style={lbl}>Competitor（競合他社）</label><textarea name="competitors" defaultValue={company.competitors ?? ""} placeholder="例: ○○株式会社..." style={taStyle(3)} /></div>
        </div>

        {/* SWOT分析 */}
        <div style={card}>
          <p style={sec}>SWOT分析（任意）</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={{ ...lbl, color: "#34d399" }}>S（強み）</label><textarea name="swotStrength" defaultValue={company.swotStrength ?? ""} placeholder="内部環境の強み" style={taStyle(4)} /></div>
            <div><label style={{ ...lbl, color: "#f87171" }}>W（弱み）</label><textarea name="swotWeakness" defaultValue={company.swotWeakness ?? ""} placeholder="内部環境の弱み" style={taStyle(4)} /></div>
            <div><label style={{ ...lbl, color: "#60a5fa" }}>O（機会）</label><textarea name="swotOpportunity" defaultValue={company.swotOpportunity ?? ""} placeholder="外部環境の機会" style={taStyle(4)} /></div>
            <div><label style={{ ...lbl, color: "#fb923c" }}>T（脅威）</label><textarea name="swotThreat" defaultValue={company.swotThreat ?? ""} placeholder="外部環境の脅威" style={taStyle(4)} /></div>
          </div>
        </div>

        {/* VMV */}
        <div style={card}>
          <p style={sec}>VMV（任意）</p>
          <div><label style={lbl}>Vision（ビジョン）</label><textarea name="vision" defaultValue={company.vision ?? ""} placeholder="企業が目指す将来像" style={taStyle(2)} /></div>
          <div><label style={lbl}>Mission（ミッション）</label><textarea name="mission" defaultValue={company.mission ?? ""} placeholder="企業の使命・存在意義" style={taStyle(2)} /></div>
          <div><label style={lbl}>Value（バリュー）</label><textarea name="companyValue" defaultValue={company.companyValue ?? ""} placeholder="企業が大切にしている価値観" style={taStyle(2)} /></div>
        </div>

        {/* 備考 */}
        <div style={card}>
          <p style={sec}>備考</p>
          <textarea name="notes" defaultValue={company.notes ?? ""} placeholder="自由記述" style={taStyle(3)} />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={saving} style={{
            flex: 1, padding: "10px", borderRadius: "8px", border: "none",
            background: saving ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
            color: saving ? "var(--text-3)" : "white", fontSize: "13px", fontWeight: "600",
            cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, transition: "all 0.15s",
          }}>{saving ? "保存中..." : "保存する"}</button>
          <Link href={`/companies/${id}`} style={{
            flex: 1, padding: "10px", borderRadius: "8px", textAlign: "center",
            border: "1px solid var(--border-2)", color: "var(--text-2)", fontSize: "13px",
            textDecoration: "none", background: "var(--bg-3)",
          }}>キャンセル</Link>
        </div>
      </form>
    </div>
  );
}
