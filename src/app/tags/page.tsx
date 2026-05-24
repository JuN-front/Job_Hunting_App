"use client";

import { useState } from "react";
import { createTag, deleteTag } from "@/actions/tags";
import { useEffect } from "react";

const PRESET_COLORS = [
  "#7c6af7", "#22d3ee", "#34d399", "#fbbf24",
  "#f472b6", "#fb923c", "#f87171", "#60a5fa",
  "#a78bfa", "#9399a8",
];

type Tag = { id: string; name: string; color: string };

export default function TagsPage() {
  const [userTags, setUserTags] = useState<Tag[]>([]);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);
  const [tagName, setTagName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/tags-list")
      .then(r => r.json())
      .then(data => setUserTags(data.tags));
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tagName.trim()) return;
    setSaving(true);
    const formData = new FormData();
    formData.append("name", tagName);
    formData.append("color", selectedColor);
    await createTag(formData);
    setTagName("");
    setSelectedColor(PRESET_COLORS[0]);
    // リロードして最新タグを反映
    const data = await fetch("/api/tags-list").then(r => r.json());
    setUserTags(data.tags);
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await deleteTag(id);
    setUserTags(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div style={{ maxWidth: "520px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text)", margin: "0 0 28px", letterSpacing: "-0.5px" }}>タグ管理</h1>

      {/* 作成フォーム */}
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-2)", marginBottom: "16px" }}>新しいタグを作成</p>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>タグ名</label>
            <input
              value={tagName}
              onChange={e => setTagName(e.target.value)}
              required
              placeholder="例: 第一志望、IT・Web"
              style={{
                width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "10px" }}>カラー</label>

            {/* プレビュー */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: selectedColor, flexShrink: 0,
                boxShadow: `0 0 0 3px ${selectedColor}40`,
                transition: "all 0.2s",
              }} />
              <span style={{
                fontSize: "13px", fontWeight: "500", padding: "4px 12px", borderRadius: "20px",
                color: selectedColor, background: selectedColor + "22",
              }}>
                {tagName || "タグ名プレビュー"}
              </span>
            </div>

            {/* プリセットカラー */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    background: color, border: "none", cursor: "pointer",
                    boxShadow: selectedColor === color
                      ? `0 0 0 2px var(--bg-2), 0 0 0 4px ${color}`
                      : "none",
                    transform: selectedColor === color ? "scale(1.15)" : "scale(1)",
                    transition: "all 0.15s",
                  }}
                />
              ))}
              {/* カスタムカラー */}
              <div style={{ position: "relative" }}>
                <input
                  type="color"
                  value={selectedColor}
                  onChange={e => setSelectedColor(e.target.value)}
                  style={{
                    width: "28px", height: "28px", borderRadius: "50%",
                    border: !PRESET_COLORS.includes(selectedColor)
                      ? `3px solid ${selectedColor}`
                      : "2px dashed var(--border-2)",
                    cursor: "pointer", padding: 0, background: "none",
                    boxShadow: !PRESET_COLORS.includes(selectedColor)
                      ? `0 0 0 2px var(--bg-2), 0 0 0 4px ${selectedColor}`
                      : "none",
                  }}
                  title="カスタムカラー"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              width: "100%", padding: "10px", borderRadius: "8px", border: "none",
              background: saving ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
              color: "white", fontSize: "13px", fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "作成中..." : "作成する"}
          </button>
        </form>
      </div>

      {/* タグ一覧 */}
      <div>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "10px" }}>
          作成済みタグ ({userTags.length})
        </p>
        {userTags.length === 0 ? (
          <div style={{
            background: "var(--bg-2)", border: "1px dashed var(--border-2)",
            borderRadius: "12px", padding: "40px", textAlign: "center",
            fontSize: "13px", color: "var(--text-3)",
          }}>タグがまだありません</div>
        ) : (
          <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden" }}>
            {userTags.map((tag, i) => (
              <div key={tag.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 18px",
                borderBottom: i < userTags.length - 1 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: tag.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "13px", fontWeight: "500", padding: "3px 10px", borderRadius: "20px", color: tag.color, background: tag.color + "22" }}>
                    {tag.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(tag.id)}
                  style={{ fontSize: "12px", color: "var(--text-3)", background: "none", border: "none", cursor: "pointer" }}
                >
                  削除
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
