import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { companies, memos } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ────────────────────────────────────────────────────────────
// AIプロバイダーをここで切り替える
// "gemini" | "claude"
const AI_PROVIDER = "gemini";
// ────────────────────────────────────────────────────────────

async function callGemini(systemPrompt: string, messages: { role: string; content: string }[]) {
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: m.content }],
  }));
  const lastMessage = messages[messages.length - 1].content;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [
          ...history,
          { role: "user", parts: [{ text: lastMessage }] },
        ],
        generationConfig: { maxOutputTokens: 1024 },
      }),
    }
  );
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "回答を取得できませんでした。";
}

async function callClaude(systemPrompt: string, messages: { role: string; content: string }[]) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
    }),
  });
  const data = await res.json();
  return data.content?.[0]?.text ?? "回答を取得できませんでした。";
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const userId = session.user.id;

  const { companyId, messages } = await req.json();

  // 企業データを取得
  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, companyId), eq(companies.userId, userId)),
    with: { companyTags: { with: { tag: true } }, memos: true },
  });
  if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // コンテキストを組み立てる
  const context = `
【企業名】${company.name}
【業界】${company.industry ?? "未設定"}
【選考ステータス】${company.status}${company.status2 ? ` / ${company.status2}` : ""}
【日付】${company.eventDate ? new Date(company.eventDate).toLocaleDateString("ja-JP") : "未設定"}
【タグ】${company.companyTags.map((ct: any) => ct.tag.name).join(", ") || "なし"}

【URL情報】
・公式サイト: ${company.url ?? "未設定"}
・採用HP: ${company.recruitUrl ?? "未設定"}
・マイページ: ${company.mypageUrl ?? "未設定"}

【3C分析】
・Company: ${company.company3c ?? "未記入"}
・Customer: ${company.customers ?? "未記入"}
・Competitor: ${company.competitors ?? "未記入"}

【SWOT分析】
・S（強み）: ${company.swotStrength ?? "未記入"}
・W（弱み）: ${company.swotWeakness ?? "未記入"}
・O（機会）: ${company.swotOpportunity ?? "未記入"}
・T（脅威）: ${company.swotThreat ?? "未記入"}

【VMV】
・Vision: ${company.vision ?? "未記入"}
・Mission: ${company.mission ?? "未記入"}
・Value: ${company.companyValue ?? "未記入"}

【備考】${company.notes ?? "未記入"}

【メモ一覧】
${company.memos.length === 0 ? "メモなし" : company.memos.map((m: any) => `---\n[${m.templateType}] ${m.title}\n${m.content}`).join("\n")}
`.trim();

  const systemPrompt = `あなたは就職活動をサポートするAIアシスタントです。
ユーザーが選考中の企業「${company.name}」に関する情報が以下に提供されています。
この情報をもとに、面接対策・企業研究・志望動機作成などについて日本語で丁寧にアドバイスしてください。
情報が未記入の項目については、一般的な知識で補足しても構いません。

【企業情報】
${context}`;

  try {
    let reply: string;
    if (AI_PROVIDER === "gemini") {
      reply = await callGemini(systemPrompt, messages);
    } else {
      reply = await callClaude(systemPrompt, messages);
    }
    return NextResponse.json({ reply });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "AI APIの呼び出しに失敗しました" }, { status: 500 });
  }
}