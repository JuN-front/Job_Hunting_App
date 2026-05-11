import { db } from "@/db";
import { companies } from "@/db/schema";
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

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const allCompanies = await db.query.companies.findMany({
    where: eq(companies.userId, userId),
    orderBy: (c, { desc }) => [desc(c.updatedAt)],
  });

  const recent = allCompanies.slice(0, 8);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
          <p className="text-sm text-gray-500 mt-1">全 {allCompanies.length} 社を管理中</p>
        </div>
        <Link
          href="/companies/new"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + 企業を追加
        </Link>
      </div>

      <section className="mb-8">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">選考状況</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {COMPANY_STATUSES.map((status) => {
            const count = allCompanies.filter((c) => c.status === status).length;
            return (
              <Link
                key={status}
                href={`/companies?status=${encodeURIComponent(status)}`}
                className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow"
              >
                <div className="text-2xl font-bold text-gray-900">{count}</div>
                <div className={`mt-1 inline-block text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[status]}`}>
                  {status}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">最近更新した企業</h2>
        {recent.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-300 rounded-xl p-12 text-center">
            <p className="text-gray-400 text-sm">企業がまだ登録されていません</p>
            <Link href="/companies/new" className="mt-3 inline-block text-blue-600 text-sm hover:underline">
              最初の企業を追加する →
            </Link>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {recent.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.id}`}
                className="flex items-center justify-between px-5 py-3.5 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <div className="font-medium text-gray-900 text-sm">{company.name}</div>
                  {company.industry && <div className="text-xs text-gray-400 mt-0.5">{company.industry}</div>}
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[company.status]}`}>
                  {company.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
