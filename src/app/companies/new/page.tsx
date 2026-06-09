"use client";

import { useState, useRef, useEffect } from "react";
import { createCompany } from "@/actions/companies";
import { COMPANY_STATUSES } from "@/db/schema";
import Link from "next/link";
import DatePicker from "@/components/DatePicker";

const inp: React.CSSProperties = { width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none" };
const lbl: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" };
const sec: React.CSSProperties = { fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "12px" };
const card: React.CSSProperties = { background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" };
const ta = (rows: number): React.CSSProperties => ({ ...inp, resize: "none" as const, fontFamily: "inherit", padding: "9px 12px" });

type Tag = { id: string; name: string; color: string };

export default function NewCompanyPage() {
  const [saving, setSaving] = useState(false);
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const submittingRef = useRef(false);

  useEffect(() => {
    fetch("/api/tags-list").then(r => r.json()).then(d => setUserTags(d.tags));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSaving(true);
    try {
      await createCompany(new FormData(e.currentTarget));
    } catch {
      setSaving(false);
      submittingRef.current = false;
    }
  }

  return (
    <div style={{ maxWidth: "560px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <Link href="/companies" style={{ fontSize: "18px", color: "var(--text-3)", textDecoration: "none" }}>←</Link>
        <h1 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text)", margin: 0, letterSpacing: "-0.4px" }}>企業を追加</h1>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* 基本情報 */}
        <div style={card}>
          <p style={sec}>基本情報</p>
          <div><label style={lbl}>企業名 *</label><input name="name" required placeholder="例: 株式会社〇〇" style={inp} /></div>
          <div>
            <label style={lbl}>選考ステータス①</label>
            <select name="status" style={{ ...inp, cursor: "pointer" }}>{COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div>
            <label style={lbl}>選考ステータス② <span style={{ color: "var(--text-3)", fontWeight: 400 }}>（任意）</span></label>
            <select name="status2" style={{ ...inp, cursor: "pointer" }}><option value="">なし</option>{COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}</select>
          </div>
          <div><label style={lbl}>日付 <span style={{ color: "var(--text-3)", fontWeight: 400 }}>（任意）</span></label><DatePicker name="eventDate" /></div>
          <div><label style={lbl}>業界</label><input name="industry" placeholder="例: IT・Web、金融、メーカー" style={inp} /></div>
          {userTags.length > 0 && (
            <div>
              <label style={lbl}>タグ</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                {userTags.map(tag => (
                  <label key={tag.id} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input type="checkbox" name="tagIds" value={tag.id} style={{ accentColor: tag.color }} />
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
          <div><label style={lbl}>公式URL</label><input name="url" type="url" placeholder="https://" style={inp} /></div>
          <div><label style={lbl}>新卒採用HP</label><input name="recruitUrl" type="url" placeholder="https://" style={inp} /></div>
          <div><label style={lbl}>新卒採用マイページ URL</label><input name="mypageUrl" type="url" placeholder="https://" style={inp} /></div>
          <div><label style={lbl}>マイページ ID</label><input name="mypageId" placeholder="例: taro.yamada@example.com" style={inp} /></div>
          <div>
            <label style={lbl}>マイページ パスワード（メモ）</label>
            <input name="mypagePassword" type="text" placeholder="例: MyPass1234" style={inp} />
            <p style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "4px" }}>※ 暗号化されずに保存されます。取り扱いにご注意ください。</p>
          </div>
        </div>

        {/* 3C分析 */}
        <div style={card}>
          <p style={sec}>3C分析（任意）</p>
          <div><label style={lbl}>Company（自社・企業の特徴）</label><textarea name="company3c" rows={3} placeholder="例: 国内シェアNo.1、独自の〇〇技術..." style={ta(3)} /></div>
          <div><label style={lbl}>Customer（顧客・市場）</label><textarea name="customers" rows={3} placeholder="例: 大手製造業、官公庁..." style={ta(3)} /></div>
          <div><label style={lbl}>Competitor（競合他社）</label><textarea name="competitors" rows={3} placeholder="例: ○○株式会社、△△社..." style={ta(3)} /></div>
        </div>

        {/* SWOT分析 */}
        <div style={card}>
          <p style={sec}>SWOT分析（任意）</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div><label style={{ ...lbl, color: "#34d399" }}>S（強み）</label><textarea name="swotStrength" rows={4} placeholder="内部環境の強み" style={ta(4)} /></div>
            <div><label style={{ ...lbl, color: "#f87171" }}>W（弱み）</label><textarea name="swotWeakness" rows={4} placeholder="内部環境の弱み" style={ta(4)} /></div>
            <div><label style={{ ...lbl, color: "#60a5fa" }}>O（機会）</label><textarea name="swotOpportunity" rows={4} placeholder="外部環境の機会" style={ta(4)} /></div>
            <div><label style={{ ...lbl, color: "#fb923c" }}>T（脅威）</label><textarea name="swotThreat" rows={4} placeholder="外部環境の脅威" style={ta(4)} /></div>
          </div>
        </div>

        {/* VMV */}
        <div style={card}>
          <p style={sec}>VMV（任意）</p>
          <div><label style={lbl}>Vision（ビジョン）</label><textarea name="vision" rows={2} placeholder="企業が目指す将来像" style={ta(2)} /></div>
          <div><label style={lbl}>Mission（ミッション）</label><textarea name="mission" rows={2} placeholder="企業の使命・存在意義" style={ta(2)} /></div>
          <div><label style={lbl}>Value（バリュー）</label><textarea name="companyValue" rows={2} placeholder="企業が大切にしている価値観" style={ta(2)} /></div>
        </div>

        {/* SWOT分析 */}
        <div style={card}>
          <p style={sec}>SWOT分析（任意）</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ ...lbl, color: "#34d399" }}>S（強み）</label>
              <textarea name="swotStrength" rows={4} placeholder="内部環境の強み" style={ta(4)} />
            </div>
            <div>
              <label style={{ ...lbl, color: "#f87171" }}>W（弱み）</label>
              <textarea name="swotWeakness" rows={4} placeholder="内部環境の弱み" style={ta(4)} />
            </div>
            <div>
              <label style={{ ...lbl, color: "#60a5fa" }}>O（機会）</label>
              <textarea name="swotOpportunity" rows={4} placeholder="外部環境の機会" style={ta(4)} />
            </div>
            <div>
              <label style={{ ...lbl, color: "#fb923c" }}>T（脅威）</label>
              <textarea name="swotThreat" rows={4} placeholder="外部環境の脅威" style={ta(4)} />
            </div>
          </div>
        </div>

        {/* 備考 */}
        <div style={card}>
          <p style={sec}>備考</p>
          <textarea name="notes" rows={3} placeholder="自由記述" style={ta(3)} />
        </div>

        <button type="submit" disabled={saving} style={{
          width: "100%", padding: "10px", borderRadius: "8px", border: "none",
          background: saving ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
          color: saving ? "var(--text-3)" : "white", fontSize: "13px", fontWeight: "600",
          cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, transition: "all 0.15s",
        }}>{saving ? "保存中..." : "追加する"}</button>
      </form>
    </div>
  );
}
