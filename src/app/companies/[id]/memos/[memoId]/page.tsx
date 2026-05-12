import { db } from "@/db";
import { memos, companies } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateMemo, deleteMemo } from "@/actions/memos";
import Link from "next/link";

type Props = { params: Promise<{ id: string; memoId: string }> };

export default async function MemoPage({ params }: Props) {
  const { id, memoId } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, id), eq(companies.userId, userId)),
  });
  if (!company) notFound();

  const memo = await db.query.memos.findFirst({
    where: and(eq(memos.id, memoId), eq(memos.companyId, id)),
  });
  if (!memo) notFound();

  const updateAction = updateMemo.bind(null, memo.id, id);
  const deleteAction = deleteMemo.bind(null, memo.id, id);

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <Link href={`/companies/${id}`} style={{ fontSize: "18px", color: "var(--text-3)", textDecoration: "none" }}>←</Link>
        <span style={{ fontSize: "13px", color: "var(--text-3)" }}>{company.name}</span>
      </div>

      <form action={updateAction} style={{
        background: "var(--bg-2)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "11px", color: "var(--text-3)", background: "var(--bg-4)", padding: "3px 10px", borderRadius: "6px" }}>
            {memo.templateType}
          </span>
          <form action={deleteAction}>
            <button type="submit" style={{
              fontSize: "12px", color: "var(--red)", background: "none", border: "none", cursor: "pointer",
            }}>削除</button>
          </form>
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
          <button type="submit" style={{
            flex: 1, padding: "10px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, var(--accent), #6457e8)",
            color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>保存する</button>
          <Link href={`/companies/${id}`} style={{
            flex: 1, padding: "10px", borderRadius: "8px", textAlign: "center",
            border: "1px solid var(--border-2)", color: "var(--text-2)", fontSize: "13px", textDecoration: "none",
            background: "var(--bg-3)",
          }}>戻る</Link>
        </div>
      </form>
    </div>
  );
}
