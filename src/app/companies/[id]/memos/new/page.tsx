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
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/companies/${id}`} className="text-gray-400 hover:text-gray-600">←</Link>
        <h1 className="text-2xl font-bold text-gray-900">メモを追加</h1>
      </div>

      <form action={action} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input name="title" required placeholder="例: 一次面接メモ" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">テンプレート</label>
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATE_TYPES.map((type) => (
              <label key={type} className="cursor-pointer">
                <input type="radio" name="templateType" value={type} className="sr-only peer" defaultChecked={type === "自由メモ"} />
                <div className="text-xs font-medium text-center py-2 px-3 rounded-lg border border-gray-200 peer-checked:border-blue-500 peer-checked:bg-blue-50 peer-checked:text-blue-700 hover:bg-gray-50 transition-colors">
                  {type}
                </div>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea name="content" rows={16} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
            保存する
          </button>
          <Link href={`/companies/${id}`} className="flex-1 text-center border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            キャンセル
          </Link>
        </div>
      </form>

      <script dangerouslySetInnerHTML={{ __html: `
        const defaults = ${JSON.stringify(TEMPLATE_DEFAULTS)};
        document.querySelectorAll('input[name="templateType"]').forEach(radio => {
          radio.addEventListener('change', e => {
            const textarea = document.querySelector('textarea[name="content"]');
            if (textarea && !textarea.value.trim()) {
              textarea.value = defaults[e.target.value] || '';
            }
          });
        });
      `}} />
    </div>
  );
}
