import { db } from "@/db";
import { companies, tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { deleteCompany, updateCompanyStatus } from "@/actions/companies";
import { COMPANY_STATUSES } from "@/db/schema";

const statusColors: Record<string, string> = {
  説明会: "bg-gray-100 text-gray-600",
  ES提出: "bg-blue-100 text-blue-700",
  一次面接: "bg-cyan-100 text-cyan-700",
  二次面接: "bg-indigo-100 text-indigo-700",
  最終面接: "bg-purple-100 text-purple-700",
  内定: "bg-green-100 text-green-700",
  入社予定: "bg-emerald-100 text-emerald-700",
  辞退: "bg-orange-100 text-orange-700",
  不合格: "bg-red-100 text-red-700",
};

type Props = { params: Promise<{ id: string }> };

export default async function CompanyDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const userId = session!.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, id), eq(companies.userId, userId)),
    with: {
      companyTags: { with: { tag: true } },
      memos: { orderBy: (m, { desc }) => [desc(m.updatedAt)] },
    },
  });

  if (!company) notFound();

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });

  return (
    <div className="max-w-2xl">
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link href="/companies" className="text-sm text-gray-400 hover:text-gray-600">← 企業一覧</Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-1">{company.name}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            {company.industry && <span className="text-sm text-gray-500">{company.industry}</span>}
            {company.url && (
              <a href={company.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline">
                公式サイト ↗
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/companies/${company.id}/edit`} className="text-sm border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
            編集
          </Link>
          <form action={deleteCompany.bind(null, company.id)}>
            <button type="submit" className="text-sm border border-red-200 text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
              削除
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">選考ステータス</h2>
        <div className="flex flex-wrap gap-2">
          {COMPANY_STATUSES.map((status) => (
            <form key={status} action={updateCompanyStatus.bind(null, company.id, status)}>
              <button
                type="submit"
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-all border ${
                  company.status === status
                    ? `${statusColors[status]} border-current scale-105 shadow-sm`
                    : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {status}
              </button>
            </form>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">タグ</h2>
        <div className="flex flex-wrap gap-2">
          {company.companyTags.length === 0 ? (
            <span className="text-sm text-gray-400">タグなし</span>
          ) : (
            company.companyTags.map(({ tag }) => (
              <span key={tag.id} style={{ background: tag.color + "22", color: tag.color }} className="text-xs font-medium px-2.5 py-1 rounded-full">
                {tag.name}
              </span>
            ))
          )}
          <Link href={`/companies/${company.id}/edit`} className="text-xs text-gray-400 hover:text-blue-600 underline ml-1">
            編集
          </Link>
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">メモ ({company.memos.length})</h2>
        <Link href={`/companies/${company.id}/memos/new`} className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors">
          + メモを追加
        </Link>
      </div>

      {company.memos.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">メモがまだありません</p>
          <Link href={`/companies/${company.id}/memos/new`} className="mt-2 inline-block text-blue-600 text-sm hover:underline">
            最初のメモを作成 →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {company.memos.map((memo) => (
            <Link key={memo.id} href={`/companies/${company.id}/memos/${memo.id}`} className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm text-gray-900">{memo.title}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{memo.templateType}</span>
              </div>
              <p className="text-xs text-gray-400 line-clamp-2 whitespace-pre-wrap">{memo.content || "（内容なし）"}</p>
            </Link>
          ))}
        </div>
      )}

      {company.notes && (
        <div className="mt-5 bg-white border border-gray-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-gray-700 mb-2">備考</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{company.notes}</p>
        </div>
      )}
    </div>
  );
}
