"use client";

import { useState, useEffect, useRef } from "react";
import { createJobSiteAccount, updateJobSiteAccount, deleteJobSiteAccount } from "@/actions/jobSiteAccounts";

const inp: React.CSSProperties = {
  width: "100%", background: "var(--bg-3)", border: "1px solid var(--border-2)",
  borderRadius: "8px", padding: "9px 12px", fontSize: "13px", color: "var(--text)", outline: "none",
};
const lbl: React.CSSProperties = {
  display: "block", fontSize: "12px", fontWeight: "500", color: "var(--text-2)", marginBottom: "6px",
};

type Account = {
  id: string; siteName: string; siteUrl: string | null;
  loginId: string | null; password: string | null; notes: string | null;
};

// パスワードの表示/非表示トグル
function PasswordCell({ value }: { value: string | null }) {
  const [show, setShow] = useState(false);
  if (!value) return <span style={{ color: "var(--text-3)" }}>—</span>;
  return (
    <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
      <span style={{ fontFamily: "monospace", fontSize: "13px" }}>
        {show ? value : "••••••••"}
      </span>
      <button onClick={() => setShow(s => !s)} style={{
        background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: "12px", padding: "0 4px",
      }}>{show ? "隠す" : "表示"}</button>
    </span>
  );
}

// モーダル（追加・編集共用）
function AccountModal({
  account, onClose, onSave,
}: {
  account: Account | null;
  onClose: () => void;
  onSave: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const submittingRef = useRef(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      if (account) {
        await updateJobSiteAccount(account.id, formData);
      } else {
        await createJobSiteAccount(formData);
      }
      onSave();
      onClose();
    } catch {
      setSaving(false);
      submittingRef.current = false;
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onClose}>
      <div style={{
        background: "var(--bg-2)", border: "1px solid var(--border)", borderRadius: "16px",
        padding: "28px", width: "100%", maxWidth: "440px", boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      }} onClick={e => e.stopPropagation()}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", color: "var(--text)", margin: "0 0 20px", letterSpacing: "-0.3px" }}>
          {account ? "アカウントを編集" : "アカウントを追加"}
        </h2>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={lbl}>就活サイト名 *</label>
            <input name="siteName" required defaultValue={account?.siteName ?? ""} placeholder="例: リクナビ、マイナビ、OneCareer" style={inp} />
          </div>
          <div>
            <label style={lbl}>サイトURL</label>
            <input name="siteUrl" type="url" defaultValue={account?.siteUrl ?? ""} placeholder="https://" style={inp} />
          </div>
          <div>
            <label style={lbl}>ログインID / メールアドレス</label>
            <input name="loginId" defaultValue={account?.loginId ?? ""} placeholder="例: taro@example.com" style={inp} />
          </div>
          <div>
            <label style={lbl}>パスワード</label>
            <input name="password" type="text" defaultValue={account?.password ?? ""} placeholder="例: MyPass1234" style={inp} />
            <p style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "4px" }}>※ 暗号化されずに保存されます。取り扱いにご注意ください。</p>
          </div>
          <div>
            <label style={lbl}>メモ</label>
            <textarea name="notes" defaultValue={account?.notes ?? ""} rows={2} placeholder="例: 登録日、使用状況など" style={{ ...inp, resize: "none", fontFamily: "inherit" }} />
          </div>

          <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
            <button type="submit" disabled={saving} style={{
              flex: 1, padding: "10px", borderRadius: "8px", border: "none",
              background: saving ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
              color: saving ? "var(--text-3)" : "white", fontSize: "13px", fontWeight: "600",
              cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1,
            }}>{saving ? "保存中..." : "保存する"}</button>
            <button type="button" onClick={onClose} style={{
              padding: "10px 18px", borderRadius: "8px",
              border: "1px solid var(--border-2)", color: "var(--text-2)",
              fontSize: "13px", background: "var(--bg-3)", cursor: "pointer",
            }}>キャンセル</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function JobSitesPage() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Account | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/job-sites");
    const data = await res.json();
    setAccounts(data.accounts ?? []);
  }

  useEffect(() => { load(); }, []);

  function openAdd() { setEditTarget(null); setModalOpen(true); }
  function openEdit(a: Account) { setEditTarget(a); setModalOpen(true); }

  async function handleDelete(id: string) {
    await deleteJobSiteAccount(id);
    setDeleteConfirm(null);
    load();
  }

  return (
    <div style={{ maxWidth: "760px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "28px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "600", color: "var(--text)", margin: "0 0 4px", letterSpacing: "-0.5px" }}>就活サイト管理</h1>
          <p style={{ fontSize: "13px", color: "var(--text-3)", margin: 0 }}>登録している就活サイトのアカウント情報を管理します</p>
        </div>
        <button onClick={openAdd} style={{
          padding: "8px 16px", borderRadius: "8px", border: "none",
          background: "linear-gradient(135deg, var(--accent), #6457e8)",
          color: "white", fontSize: "13px", fontWeight: "600", cursor: "pointer",
        }}>+ 追加</button>
      </div>

      {accounts.length === 0 ? (
        <div style={{
          background: "var(--bg-2)", border: "1px dashed var(--border-2)",
          borderRadius: "12px", padding: "60px", textAlign: "center",
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "12px" }}>まだ登録されていません</p>
          <button onClick={openAdd} style={{
            fontSize: "13px", color: "var(--accent-2)", background: "none", border: "none", cursor: "pointer",
          }}>最初のアカウントを追加する →</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {accounts.map(account => (
            <div key={account.id} style={{
              background: "var(--bg-2)", border: "1px solid var(--border)",
              borderRadius: "12px", padding: "18px 20px",
            }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "12px" }}>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--text)", marginBottom: "4px" }}>
                    {account.siteName}
                  </div>
                  {account.siteUrl && (
                    <a href={account.siteUrl} target="_blank" rel="noopener noreferrer"
                      style={{ fontSize: "12px", color: "var(--accent-2)", textDecoration: "none" }}>
                      {account.siteUrl} ↗
                    </a>
                  )}
                </div>
                <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                  <button onClick={() => openEdit(account)} style={{
                    padding: "5px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: "500",
                    border: "1px solid var(--border-2)", color: "var(--text-2)",
                    background: "var(--bg-3)", cursor: "pointer",
                  }}>編集</button>
                  {deleteConfirm === account.id ? (
                    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                      <span style={{ fontSize: "12px", color: "var(--text-3)" }}>本当に削除？</span>
                      <button onClick={() => handleDelete(account.id)} style={{
                        padding: "5px 10px", borderRadius: "7px", fontSize: "12px", fontWeight: "500",
                        border: "none", background: "var(--red)", color: "white", cursor: "pointer",
                      }}>削除</button>
                      <button onClick={() => setDeleteConfirm(null)} style={{
                        padding: "5px 10px", borderRadius: "7px", fontSize: "12px",
                        border: "1px solid var(--border-2)", color: "var(--text-2)",
                        background: "var(--bg-3)", cursor: "pointer",
                      }}>取消</button>
                    </div>
                  ) : (
                    <button onClick={() => setDeleteConfirm(account.id)} style={{
                      padding: "5px 12px", borderRadius: "7px", fontSize: "12px", fontWeight: "500",
                      border: "1px solid rgba(248,113,113,0.3)", color: "var(--red)",
                      background: "rgba(248,113,113,0.08)", cursor: "pointer",
                    }}>削除</button>
                  )}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div>
                  <p style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "3px" }}>ID / メールアドレス</p>
                  <p style={{ fontSize: "13px", color: "var(--text-2)", margin: 0 }}>
                    {account.loginId ?? <span style={{ color: "var(--text-3)" }}>—</span>}
                  </p>
                </div>
                <div>
                  <p style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "3px" }}>パスワード</p>
                  <PasswordCell value={account.password} />
                </div>
                {account.notes && (
                  <div style={{ gridColumn: "1 / -1" }}>
                    <p style={{ fontSize: "11px", color: "var(--text-3)", marginBottom: "3px" }}>メモ</p>
                    <p style={{ fontSize: "13px", color: "var(--text-2)", margin: 0, whiteSpace: "pre-wrap" }}>{account.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AccountModal
          account={editTarget}
          onClose={() => setModalOpen(false)}
          onSave={load}
        />
      )}
    </div>
  );
}