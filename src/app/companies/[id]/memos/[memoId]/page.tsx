"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { updateMemo, deleteMemo } from "@/actions/memos";
import Link from "next/link";
import { use } from "react";

type Props = { params: Promise<{ id: string; memoId: string }> };

export default function MemoPage({ params }: Props) {
  const { id, memoId } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [memo, setMemo] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const submittingRef = useRef(false);

  useEffect(() => {
    fetch(`/api/companies/${id}/memos/${memoId}`)
      .then(r => r.json())
      .then(data => { setMemo(data.memo); setCompany(data.company); });
  }, [id, memoId]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSaving(true);

    try {
      const formData = new FormData(e.currentTarget);
      await updateMemo(memoId, id, formData);
      router.push(`/companies/${id}`);
      router.refresh();
    } catch {
      setSaving(false);
      submittingRef.current = false;
    }
  }

  async function handleDelete() {
    if (!window.confirm("このメモを削除しますか？")) return;
    setDeleting(true);
    await deleteMemo(memoId, id);
    router.push(`/companies/${id}`);
    router.refresh();
  }

  if (!memo) return (
    <div style={{ color: "var(--text-3)", fontSize: "13px", padding: "40px" }}>読み込み中...</div>
  );

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <Link href={`/companies/${id}`} style={{ fontSize: "18px", color: "var(--text-3)", textDecoration: "none" }}>←</Link>
        <span style={{ fontSize: "13px", color: "var(--text-3)" }}>{company?.name}</span>
      </div>

      <form onSubmit={handleSubmit} style={{
        background: "var(--bg-2)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--text-3)", background: "var(--bg-4)", padding: "3px 10px", borderRadius: "6px" }}>
            {memo.templateType}
          </span>
          <button type="button" onClick={handleDelete} disabled={deleting} style={{
            fontSize: "12px", color: "var(--red)", background: "none", border: "none",
            cursor: deleting ? "not-allowed" : "pointer", opacity: deleting ? 0.5 : 1,
          }}>
            {deleting ? "削除中..." : "削除"}
          </button>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>タイトル</label>
          <input name="title" required defaultValue={memo.title} style={{
            width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
            borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
          }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>内容</label>
          <textarea name="content" rows={22} defaultValue={memo.content} style={{
            width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
            borderRadius: "8px", padding: "12px", fontSize: "13px", color: "var(--text)",
            outline: "none", resize: "vertical", fontFamily: "'DM Mono', monospace", lineHeight: "1.6",
          }} />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" disabled={saving} style={{
            flex: 1, padding: "10px", borderRadius: "8px", border: "none",
            background: saving ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
            color: saving ? "var(--text-3)" : "white",
            fontSize: "13px", fontWeight: "600",
            cursor: saving ? "not-allowed" : "pointer",
            opacity: saving ? 0.7 : 1,
            transition: "all 0.15s",
          }}>
            {saving ? "保存中..." : "保存する"}
          </button>
          <Link href={`/companies/${id}`} style={{
            flex: 1, padding: "10px", borderRadius: "8px", textAlign: "center",
            border: "1px solid var(--border-2)", color: "var(--text-2)", fontSize: "13px",
            textDecoration: "none", background: "var(--bg-3)",
          }}>戻る</Link>
        </div>
      </form>
    </div>
  );
}
