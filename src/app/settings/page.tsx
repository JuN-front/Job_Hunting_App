"use client";

import { useState, useRef } from "react";
import { deleteAccount, updateLogo } from "@/actions/auth";

export default function SettingsPage() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  async function handleLogoUpload() {
    if (!logoPreview) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("logoBase64", logoPreview);
    await updateLogo(formData);
    setUploading(false);
    alert("ロゴを更新したぞい！");
  }

  return (
    <div style={{ maxWidth: "480px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text)", margin: "0 0 28px", letterSpacing: "-0.5px" }}>設定</h1>

      {/* ロゴ設定 */}
      <div style={{ background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "14px", padding: "22px", marginBottom: "16px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--text-3)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "16px" }}>ロゴ・アイコン</p>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "14px", overflow: "hidden",
            background: logoPreview ? "transparent" : "linear-gradient(135deg, var(--accent), var(--cyan))",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "1px solid var(--border-2)", flexShrink: 0,
          }}>
            {logoPreview
              ? <img src={logoPreview} alt="logo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <span style={{ fontSize: "28px", fontWeight: "700", color: "white" }}>J</span>
            }
          </div>
          <div>
            <button onClick={() => fileRef.current?.click()} style={{
              padding: "7px 14px", borderRadius: "7px", fontSize: "12px", fontWeight: "500",
              border: "1px solid var(--border-2)", color: "var(--text-2)", background: "var(--bg-3)", cursor: "pointer",
              display: "block", marginBottom: "6px",
            }}>画像を選択</button>
            <p style={{ fontSize: "11px", color: "var(--text-3)", margin: 0 }}>PNG / JPG / SVG · 推奨サイズ 256×256px</p>
          </div>
        </div>

        <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

        {logoPreview && (
          <button onClick={handleLogoUpload} disabled={uploading} style={{
            width: "100%", padding: "9px", borderRadius: "8px", border: "none",
            background: "linear-gradient(135deg, var(--accent), #6457e8)",
            color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
          }}>
            {uploading ? "保存中..." : "ロゴを保存"}
          </button>
        )}
      </div>

      {/* 退会 */}
      <div style={{ background: "var(--bg-2)", border: "1px solid rgba(248,113,113,0.2)", borderRadius: "14px", padding: "22px" }}>
        <p style={{ fontSize: "11px", fontWeight: "600", color: "var(--red)", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "8px" }}>アカウント削除</p>
        <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "16px" }}>
          アカウントを削除すると、すべての企業・メモ・タグが完全に削除されます。この操作は取り消せません。
        </p>
        {!deleteConfirm ? (
          <button onClick={() => setDeleteConfirm(true)} style={{
            padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "500",
            border: "1px solid rgba(248,113,113,0.4)", color: "var(--red)",
            background: "rgba(248,113,113,0.08)", cursor: "pointer",
          }}>アカウントを削除する</button>
        ) : (
          <div style={{ background: "rgba(248,113,113,0.08)", borderRadius: "10px", padding: "14px" }}>
            <p style={{ fontSize: "13px", color: "var(--red)", marginBottom: "12px", fontWeight: "500" }}>
              本当に削除しますか？
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <form action={deleteAccount}>
                <button type="submit" style={{
                  padding: "7px 16px", borderRadius: "7px", fontSize: "13px", fontWeight: "600",
                  border: "none", background: "var(--red)", color: "white", cursor: "pointer",
                }}>削除</button>
              </form>
              <button onClick={() => setDeleteConfirm(false)} style={{
                padding: "7px 16px", borderRadius: "7px", fontSize: "13px",
                border: "1px solid var(--border-2)", color: "var(--text-2)", background: "var(--bg-3)", cursor: "pointer",
              }}>キャンセル</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
