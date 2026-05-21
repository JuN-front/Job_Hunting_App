"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { COMPANY_STATUSES } from "@/db/schema";
import { statusConfig, fallbackCfg } from "@/lib/statusConfig";
import { Suspense } from "react";

type Company = {
  id: string; name: string; status: string; status2: string | null;
  industry: string | null; eventDate: string | null;
  companyTags: { tag: { id: string; name: string; color: string } }[];
};
type Tag = { id: string; name: string; color: string };

function CompaniesContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const status = searchParams.get("status") ?? "";
  const tagId = searchParams.get("tagId") ?? "";
  const q = searchParams.get("q") ?? "";
  const sort = searchParams.get("sort") ?? "custom";

  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [userTags, setUserTags] = useState<Tag[]>([]);

  useEffect(() => {
    fetch("/api/companies-list")
      .then(r => r.json())
      .then(data => { setAllCompanies(data.companies); setUserTags(data.tags); });
  }, []);

  const filtered = allCompanies
    .filter(c => {
      if (status && c.status !== status && c.status2 !== status) return false;
      if (tagId && !c.companyTags.some(ct => ct.tag.id === tagId)) return false;
      if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "date") {
        if (!a.eventDate && !b.eventDate) return 0;
        if (!a.eventDate) return 1;
        if (!b.eventDate) return -1;
        return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
      }
      return 0; // custom: API返却順のまま
    });

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value); else params.delete(key);
    router.push(`/companies?${params.toString()}`);
  }

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
        }}>+ 企業を追加</Link>
      </div>

      {/* フィルタ */}
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            value={q} placeholder="企業名で検索..."
            onChange={e => updateParam("q", e.target.value)}
            style={{ flex: "1", minWidth: "160px", background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "7px", padding: "7px 12px", fontSize: "13px", color: "var(--text)", outline: "none" }}
          />
          <select value={status} onChange={e => updateParam("status", e.target.value)} style={{ background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "7px", padding: "7px 12px", fontSize: "13px", color: "var(--text)", outline: "none" }}>
            <option value="">すべてのステータス</option>
            {COMPANY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={tagId} onChange={e => updateParam("tagId", e.target.value)} style={{ background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "7px", padding: "7px 12px", fontSize: "13px", color: "var(--text)", outline: "none" }}>
            <option value="">すべてのタグ</option>
            {userTags.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={sort} onChange={e => updateParam("sort", e.target.value)} style={{ background: "var(--bg-3)", border: "1px solid var(--border-2)", borderRadius: "7px", padding: "7px 12px", fontSize: "13px", color: "var(--text)", outline: "none" }}>
            <option value="custom">カスタム順</option>
            <option value="date">日付が近い順</option>
          </select>
          {(q || status || tagId) && (
            <Link href="/companies" style={{ fontSize: "13px", color: "var(--text-3)", textDecoration: "none" }}>リセット</Link>
          )}
        </div>
      </div>

      {/* 一覧 */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px", color: "var(--text-3)", fontSize: "13px" }}>条件に一致する企業はありません</div>
      ) : (
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
          {filtered.map((company, i) => {
            const cfg = statusConfig[company.status] ?? fallbackCfg;
            const cfg2 = company.status2 ? (statusConfig[company.status2] ?? fallbackCfg) : null;
            return (
              <Link key={company.id} href={`/companies/${company.id}`} style={{
                display: "flex", alignItems: "center", gap: "12px", padding: "13px 18px",
                borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
                textDecoration: "none",
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)" }}>{company.name}</div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "4px", flexWrap: "wrap", alignItems: "center" }}>
                    {company.industry && <span style={{ fontSize: "11px", color: "var(--text-3)" }}>{company.industry}</span>}
                    {company.eventDate && (
                      <span style={{ fontSize: "11px", color: "var(--text-3)" }}>
                        📅 {new Date(company.eventDate).toLocaleDateString("ja-JP", { month: "numeric", day: "numeric" })}
                      </span>
                    )}
                    {company.companyTags.map(({ tag }) => (
                      <span key={tag.id} style={{ fontSize: "11px", fontWeight: "500", padding: "1px 7px", borderRadius: "20px", color: tag.color, background: tag.color + "22" }}>{tag.name}</span>
                    ))}
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
    </div>
  );
}

export default function CompaniesPage() {
  return <Suspense><CompaniesContent /></Suspense>;
}
