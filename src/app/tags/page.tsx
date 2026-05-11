import { db } from "@/db";
import { tags } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { createTag, deleteTag } from "@/actions/tags";

const PRESET_COLORS = [
  "#3b82f6", "#ef4444", "#22c55e", "#f59e0b",
  "#8b5cf6", "#ec4899", "#06b6d4", "#f97316",
  "#64748b", "#10b981",
];

export default async function TagsPage() {
  const session = await auth();
  const userTags = await db.query.tags.findMany({
    where: eq(tags.userId, session!.user.id),
  });

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">タグ管理</h1>

      {/* タグ作成フォーム */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">新しいタグを作成</h2>
        <form action={createTag} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">タグ名</label>
            <input
              name="name"
              required
              placeholder="例: 第一志望、IT・Web"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">カラー</label>
            <div className="flex items-center gap-2 flex-wrap">
              {PRESET_COLORS.map((color) => (
                <label key={color} className="cursor-pointer">
                  <input type="radio" name="color" value={color} className="sr-only peer" defaultChecked={color === "#3b82f6"} />
                  <div
                    style={{ background: color }}
                    className="w-7 h-7 rounded-full peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-gray-500 transition-all"
                  />
                </label>
              ))}
              <input type="color" name="color" className="w-7 h-7 rounded-full border-0 cursor-pointer" title="カスタムカラー" />
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors">
            作成する
          </button>
        </form>
      </div>

      {/* タグ一覧 */}
      <div>
        <h2 className="text-sm font-semibold text-gray-700 mb-3">作成済みタグ ({userTags.length})</h2>
        {userTags.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-300 rounded-xl">
            タグがまだありません
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
            {userTags.map((tag) => (
              <div key={tag.id} className="flex items-center justify-between px-4 py-3">
                <span
                  style={{ background: tag.color + "22", color: tag.color }}
                  className="text-sm font-medium px-3 py-1 rounded-full"
                >
                  {tag.name}
                </span>
                <form action={deleteTag.bind(null, tag.id)}>
                  <button type="submit" className="text-xs text-gray-400 hover:text-red-500 transition-colors">
                    削除
                  </button>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
