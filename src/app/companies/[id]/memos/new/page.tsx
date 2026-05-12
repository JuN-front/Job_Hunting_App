import { createMemo } from "@/actions/memos";
import { TEMPLATE_TYPES } from "@/db/schema";
import Link from "next/link";

const TEMPLATE_DEFAULTS: Record<string, string> = {
  企業研究: `## 事業内容\n\n## 強み・特徴\n\n## 志望理由\n\n## 懸念点・確認したいこと\n`,
  面接メモ: `## 面接日時\n\n## 面接形式\n例: 個人 / 集団 / オンライン\n\n## 質問と回答\nQ:\nA:\n\n## 感想・反省\n\n## 次回に向けての準備\n`,
  "ES・書類": `## 設問と回答\n\n### 設問1\nQ:\nA:\n\n## 提出期限\n\n## 提出状況\n`,
  "OB/OG訪問": `## 訪問日時・場所\n\n## 訪問者プロフィール\n\n## 聞いた内容\n\n## 感想・学び\n`,
  自由メモ: "",
};

type Props = { params: Promise<{ id: string }> };

export default async function NewMemoPage({ params }: Props) {
  const { id } = await params;
  const action = createMemo.bind(null, id);

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <Link href={`/companies/${id}`} style={{ fontSize: "18px", color: "var(--text-3)", textDecoration: "none" }}>←</Link>
        <h1 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text)", margin: 0, letterSpacing: "-0.4px" }}>メモを追加</h1>
      </div>

      <form action={action} style={{
        background: "var(--bg-2)", border: "1px solid var(--border)",
        borderRadius: "14px", padding: "24px", display: "flex", flexDirection: "column", gap: "18px",
      }}>
        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>タイトル</label>
          <input name="title" required placeholder="例: 一次面接メモ" style={{
            width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
            borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
          }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "8px" }}>テンプレート</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "6px" }}>
            {TEMPLATE_TYPES.map(type => (
              <label key={type} style={{ cursor: "pointer" }}>
                <input type="radio" name="templateType" value={type} style={{ display: "none" }} defaultChecked={type === "自由メモ"} />
                <div style={{
                  fontSize: "11px", fontWeight: "500", textAlign: "center", padding: "7px 4px",
                  borderRadius: "7px", border: "1px solid var(--border-2)",
                  color: "var(--text-2)", background: "var(--bg-3)", transition: "all 0.15s",
                }}>{type}</div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>内容</label>
          <textarea name="content" rows={18} style={{
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
          }}>キャンセル</Link>
        </div>
      </form>

      <script dangerouslySetInnerHTML={{ __html: `
        const defaults = ${JSON.stringify(TEMPLATE_DEFAULTS)};
        document.querySelectorAll('input[name="templateType"]').forEach(radio => {
          radio.addEventListener('change', e => {
            const textarea = document.querySelector('textarea[name="content"]');
            const label = e.target.closest('label');
            document.querySelectorAll('input[name="templateType"]').forEach(r => {
              const div = r.closest('label').querySelector('div');
              div.style.color = 'var(--text-2)';
              div.style.borderColor = 'var(--border-2)';
              div.style.background = 'var(--bg-3)';
            });
            const div = label.querySelector('div');
            div.style.color = 'var(--accent-2)';
            div.style.borderColor = 'var(--accent)';
            div.style.background = 'rgba(124,106,247,0.1)';
            if (textarea && !textarea.value.trim()) {
              textarea.value = defaults[e.target.value] || '';
            }
          });
        });
      `}} />
    </div>
  );
}
