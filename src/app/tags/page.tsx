import { db } from "@/db";
import { tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { createTag, deleteTag } from "@/actions/tags";

const PRESET_COLORS = [
  "#7c6af7", "#22d3ee", "#34d399", "#fbbf24",
  "#f472b6", "#fb923c", "#f87171", "#60a5fa",
  "#a78bfa", "#9399a8",
];

export default async function TagsPage() {
  const session = await auth();
  const userId = session!.user.id;

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });

  return (
    <div style={{ maxWidth: "520px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text)", margin: "0 0 28px", letterSpacing: "-0.5px" }}>タグ管理</h1>

      {/* 作成フォーム */}
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px", marginBottom: "20px" }}>
        <p style={{ fontSize: "12px", fontWeight: "600", color: "var(--text-2)", marginBottom: "16px", letterSpacing: "0.3px" }}>新しいタグを作成</p>
        <form action={createTag} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px" }}>タグ名</label>
            <input name="name" required placeholder="例: 第一志望、IT・Web" style={{
              width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
              borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
            }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "8px" }}>カラー</label>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
              {PRESET_COLORS.map(color => (
                <label key={color} style={{ cursor: "pointer" }}>
                  <input type="radio" name="color" value={color} style={{ display: "none" }} defaultChecked={color === "#7c6af7"} />
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: color, cursor: "pointer", transition: "transform 0.15s",
                  }} />
                </label>
              ))}
              <input type="color" name="color" style={{ width: "26px", height: "26px", borderRadius: "50%", border: "none", cursor: "pointer", padding: 0, background: "none" }} title="カスタムカラー" />
            </div>
          </div>
          <button type="submit" style={{
            width: "100%", padding: "10px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, var(--accent), #6457e8)",
            color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>作成する</button>
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
                <form action={deleteTag.bind(null, tag.id)}>
                  <button type="submit" style={{
                    fontSize: "12px", color: "var(--text-3)", background: "none", border: "none", cursor: "pointer",
                  }}>削除</button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
