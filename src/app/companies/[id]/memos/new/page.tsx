"use client";

import { useState } from "react";
import { createMemo } from "@/actions/memos";
import { TEMPLATE_TYPES } from "@/db/schema";
import Link from "next/link";
import { use } from "react";

const TEMPLATE_DEFAULTS: Record<string, string> = {
  企業研究: `## 事業内容\n\n## 強み・特徴\n\n## 志望理由\n\n## 懸念点・確認したいこと\n`,
  面接メモ: `## 面接日時\n\n## 面接形式\n例: 個人 / 集団 / オンライン\n\n## 質問と回答\nQ:\nA:\n\n## 感想・反省\n\n## 次回に向けての準備\n`,
  "ES・書類": `## 設問と回答\n\n### 設問1\nQ:\nA:\n\n## 提出期限\n\n## 提出状況\n`,
  "OB/OG訪問": `## 訪問日時・場所\n\n## 訪問者プロフィール\n\n## 聞いた内容\n\n## 感想・学び\n`,
  説明会メモ: `## 開催日時・場所\n\n## 説明内容\n\n## 印象に残ったこと\n\n## 質問と回答\nQ:\nA:\n\n## 感想\n`,
  自由メモ: "",
};

type Props = { params: Promise<{ id: string }> };

export default function NewMemoPage({ params }: Props) {
  const { id } = use(params);
  const [selectedType, setSelectedType] = useState<string>("自由メモ");
  const [content, setContent] = useState("");

  const action = createMemo.bind(null, id);

  function handleTemplateSelect(type: string) {
    setSelectedType(type);
    // 内容が空のときだけ自動挿入、入力済みの場合は確認
    if (!content.trim()) {
      setContent(TEMPLATE_DEFAULTS[type] ?? "");
    } else if (window.confirm("テンプレートを適用すると現在の内容が置き換わります。よろしいですか？")) {
      setContent(TEMPLATE_DEFAULTS[type] ?? "");
    }
  }

  return (
    <div style={{ maxWidth: "640px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
        <Link href={`/companies/${id}`} style={{ fontSize: "18px", color: "var(--text-3)", textDecoration: "none" }}>←</Link>
        <h1 style={{ fontSize: "20px", fontWeight: "600", color: "var(--text)", margin: 0, letterSpacing: "-0.4px" }}>メモを追加</h1>
      </div>

      <form action={action} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
        {/* タイトル */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>タイトル</label>
          <input name="title" required placeholder="例: 一次面接メモ" style={{
            width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
            borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
          }} />
        </div>

        {/* テンプレート選択 */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <div style={{ marginBottom: "12px" }}>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "4px" }}>
              テンプレート
            </label>
            <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0 }}>
              選択するとテキストエリアに書式が自動挿入されます
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "6px" }}>
            {TEMPLATE_TYPES.map(type => {
              const isSelected = selectedType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleTemplateSelect(type)}
                  style={{
                    fontSize: "12px", fontWeight: "500", textAlign: "center",
                    padding: "9px 6px", borderRadius: "8px", cursor: "pointer",
                    border: isSelected ? "1px solid var(--accent)" : "1px solid var(--border-2)",
                    color: isSelected ? "var(--accent-2)" : "var(--text-2)",
                    background: isSelected ? "rgba(124,106,247,0.12)" : "var(--bg-3)",
                    transition: "all 0.15s",
                  }}
                >
                  {isSelected && <span style={{ marginRight: "4px" }}>✓</span>}
                  {type}
                </button>
              );
            })}
          </div>
          {/* hidden input でテンプレートタイプを送信 */}
          <input type="hidden" name="templateType" value={selectedType} />
        </div>

        {/* 内容 */}
        <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "20px" }}>
          <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>内容</label>
          <textarea
            name="content"
            rows={18}
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="テンプレートを選択すると書式が自動挿入されます"
            style={{
              width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
              borderRadius: "8px", padding: "12px", fontSize: "13px", color: "var(--text)",
              outline: "none", resize: "vertical", fontFamily: "'DM Mono', monospace", lineHeight: "1.6",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button type="submit" style={{
            flex: 1, padding: "10px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, var(--accent), #6457e8)",
            color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>保存する</button>
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
