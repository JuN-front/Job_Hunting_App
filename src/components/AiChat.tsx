"use client";

import { useState, useRef, useEffect } from "react";

type Message = { role: "user" | "assistant"; content: string };

type Props = { companyId: string; companyName: string };

export default function AiChat({ companyId, companyName }: Props) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: `こんにちは！**${companyName}**に関することなら何でも聞いてください。\n面接対策・志望動機・企業研究など、登録されたデータをもとにアドバイスします。`,
      }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyId, messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply ?? "エラーが発生しました。" }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "通信エラーが発生しました。" }]);
    } finally {
      setLoading(false);
    }
  }

  // テキストの改行と**太字**を簡易レンダリング
  function renderText(text: string) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1
              ? <strong key={j} style={{ color: "var(--text)", fontWeight: 600 }}>{part}</strong>
              : <span key={j}>{part}</span>
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  }

  return (
    <>
      {/* 浮かぶチャットボタン */}
      <button
        onClick={() => setOpen(o => !o)}
        title="AIに相談する"
        style={{
          position: "fixed", bottom: "28px", right: "28px", zIndex: 100,
          width: "52px", height: "52px", borderRadius: "50%", border: "none",
          background: "linear-gradient(135deg, var(--accent), #6457e8)",
          color: "white", fontSize: "22px", cursor: "pointer",
          boxShadow: "0 4px 20px rgba(124,106,247,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "transform 0.2s",
        }}
      >
        {open ? "✕" : "✦"}
      </button>

      {/* チャットウィンドウ */}
      {open && (
        <div style={{
          position: "fixed", bottom: "92px", right: "28px", zIndex: 99,
          width: "360px", height: "520px",
          background: "var(--bg-2)", border: "1px solid var(--border)",
          borderRadius: "16px", display: "flex", flexDirection: "column",
          boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
          overflow: "hidden",
        }}>
          {/* ヘッダー */}
          <div style={{
            padding: "14px 18px", borderBottom: "1px solid var(--border)",
            background: "var(--bg-3)", flexShrink: 0,
          }}>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "var(--text)" }}>✦ AI相談</div>
            <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "2px" }}>{companyName}のデータを参照中</div>
          </div>

          {/* メッセージ一覧 */}
          <div style={{ flex: 1, overflowY: "auto", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}>
                <div style={{
                  maxWidth: "85%", padding: "9px 13px", borderRadius: msg.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",
                  background: msg.role === "user" ? "var(--accent)" : "var(--bg-4)",
                  color: msg.role === "user" ? "white" : "var(--text)",
                  fontSize: "13px", lineHeight: "1.6",
                }}>
                  {renderText(msg.content)}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: "flex", justifyContent: "flex-start" }}>
                <div style={{
                  padding: "9px 14px", borderRadius: "14px 14px 14px 4px",
                  background: "var(--bg-4)", color: "var(--text-3)", fontSize: "13px",
                }}>
                  <span style={{ display: "inline-block", animation: "pulse 1s infinite" }}>考え中...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 入力欄 */}
          <div style={{
            padding: "12px", borderTop: "1px solid var(--border)",
            background: "var(--bg-3)", flexShrink: 0,
            display: "flex", gap: "8px", alignItems: "flex-end",
          }}>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="質問を入力… (Enterで送信)"
              rows={2}
              style={{
                flex: 1, background: "var(--bg-2)", border: "1px solid var(--border-2)",
                borderRadius: "8px", padding: "8px 10px", fontSize: "13px",
                color: "var(--text)", outline: "none", resize: "none",
                fontFamily: "inherit", lineHeight: "1.5",
              }}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              style={{
                width: "36px", height: "36px", borderRadius: "8px", border: "none",
                background: loading || !input.trim() ? "var(--bg-4)" : "linear-gradient(135deg, var(--accent), #6457e8)",
                color: "white", fontSize: "16px", cursor: loading || !input.trim() ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >↑</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}