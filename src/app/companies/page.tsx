import { db } from "@/db";
import { companies, tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import Link from "next/link";
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

type Props = {
  searchParams: Promise<{ status?: string; tagId?: string; q?: string }>;
};

export default async function CompaniesPage({ searchParams }: Props) {
  const { status, tagId, q } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");
  const userId = session.user.id as string;

  const allCompanies = await db.query.companies.findMany({
    where: eq(companies.userId, userId),
    with: { companyTags: { with: { tag: true } } },
    orderBy: (c, { desc }) => [desc(c.updatedAt)],
  });

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });

  const filtered = allCompanies.filter((c) => {
    if (status && c.status !== status) return false;
    if (tagId && !c.companyTags.some((ct) => ct.tagId === tagId)) return false;
    if (q && !c.name.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">企業一覧</h1>
        <Link
          href="/companies/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + 企業を追加
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 flex flex-wrap gap-3">
        <form className="flex gap-2 flex-wrap w-full">
          <input
            name="q"
            defaultValue={q}
            placeholder="企業名で検索..."
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm flex-1 min-w-40 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            name="status"
            defaultValue={status ?? ""}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのステータス</option>
            {COMPANY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            name="tagId"
            defaultValue={tagId ?? ""}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">すべてのタグ</option>
            {userTags.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <button
            type="submit"
            className="bg-gray-900 text-white text-sm px-4 py-1.5 rounded-lg hover:bg-gray-700 transition-colors"
          >
            絞り込む
          </button>
          <Link href="/companies" className="text-sm text-gray-400 px-3 py-1.5 hover:underline">
            リセット
          </Link>
        </form>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          条件に一致する企業はありません
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          {filtered.map((company) => (
            <Link
              key={company.id}
              href={`/companies/${company.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{company.name}</div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {company.industry && (
                    <span className="text-xs text-gray-400">{company.industry}</span>
                  )}
                  {company.companyTags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      style={{ background: tag.color + "22", color: tag.color }}
                      className="text-xs font-medium px-2 py-0.5 rounded-full"
                    >
                      {tag.name}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${statusColors[company.status]}`}>
                {company.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
