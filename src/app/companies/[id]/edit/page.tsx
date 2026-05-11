import { db } from "@/db";
import { companies, tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { updateCompany } from "@/actions/companies";
import { COMPANY_STATUSES } from "@/db/schema";
import Link from "next/link";

type Props = { params: { id: string } };

export default async function EditCompanyPage({ params }: Props) {
  const session = await auth();
  const userId = session!.user.id;

  const company = await db.query.companies.findFirst({
    where: and(eq(companies.id, params.id), eq(companies.userId, userId)),
    with: { companyTags: true },
  });

  if (!company) notFound();

  const userTags = await db.query.tags.findMany({ where: eq(tags.userId, userId) });
  const currentTagIds = company.companyTags.map((ct) => ct.tagId);

  const action = updateCompany.bind(null, company.id);

  return (
    <div className="max-w-xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/companies/${company.id}`} className="text-gray-400 hover:text-gray-600">←</Link>
        <h1 className="text-2xl font-bold text-gray-900">企業を編集</h1>
      </div>

      <form action={action} className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">企業名 *</label>
          <input name="name" required defaultValue={company.name} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">選考ステータス</label>
          <select name="status" defaultValue={company.status} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {COMPANY_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">業界</label>
          <input name="industry" defaultValue={company.industry ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">公式URL</label>
          <input name="url" type="url" defaultValue={company.url ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        {userTags.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">タグ</label>
            <div className="flex flex-wrap gap-2">
              {userTags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={tag.id}
                    defaultChecked={currentTagIds.includes(tag.id)}
                    className="rounded"
                  />
                  <span style={{ background: tag.color + "22", color: tag.color }} className="text-xs font-medium px-2 py-0.5 rounded-full">
                    {tag.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">備考</label>
          <textarea name="notes" rows={3} defaultValue={company.notes ?? ""} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
            保存する
          </button>
          <Link href={`/companies/${company.id}`} className="flex-1 text-center border border-gray-300 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors">
            キャンセル
          </Link>
        </div>
      </form>
    </div>
  );
}
