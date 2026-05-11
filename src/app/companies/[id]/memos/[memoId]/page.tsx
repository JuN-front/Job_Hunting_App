import { db } from "@/db";
import { memos, companies } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateMemo, deleteMemo } from "@/actions/memos";
import Link from "next/link";

type Props = { params: { id: string; memoId: string } };

export default async function MemoPage({ params }: Props) {
  const session = await auth();
  const userId = session!.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, params.id), eq(companies.userId, userId)),
  });
  if (!company) notFound();

  const memo = await db.query.memos.findFirst({
    where: and(eq(memos.id, params.memoId), eq(memos.companyId, params.id)),
  });
  if (!memo) notFound();

  const updateAction = updateMemo.bind(null, memo.id, params.id);
  const deleteAction = deleteMemo.bind(null, memo.id, params.id);

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/companies/${params.id}`} className="text-gray-400 hover:text-gray-600">← {company.name}</Link>
      </div>

      <form action={updateAction} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{memo.templateType}</span>
          <form action={deleteAction}>
            <button type="submit" className="text-xs text-red-500 hover:underline">削除</button>
          </form>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input name="title" required defaultValue={memo.title} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea name="content" rows={20} defaultValue={memo.content} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono resize-y" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
            保存する
          </button>
          <Link href={`/companies/${params.id}`} className="flex-1 text-center border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            戻る
          </Link>
        </div>
      </form>
    </div>
  );
}
