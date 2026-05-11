# 就活進捗管理アプリ

Next.js + Neon (PostgreSQL) + NextAuth.js で構築した就活進捗管理Webアプリです。

## 技術スタック

| 用途 | 技術 |
|------|------|
| フレームワーク | Next.js 15 (App Router) |
| 言語 | TypeScript |
| スタイリング | Tailwind CSS |
| データベース | Neon (PostgreSQL) |
| ORM | Drizzle ORM |
| 認証 | NextAuth.js v5 (Auth.js) |
| デプロイ | Vercel |

---

## デプロイ手順（オンラインで完結）

### 1. GitHubにリポジトリを作成してpush

```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. VercelにGitHubリポジトリをインポート

1. [vercel.com](https://vercel.com) にログインして「Add New Project」
2. GitHubリポジトリを選択してインポート

### 3. NeonデータベースをVercelに接続

1. Vercelダッシュボード → プロジェクト → **Storage** タブ
2. 「Create Database」→ **Neon** を選択して作成
3. `DATABASE_URL` が環境変数に自動追加されます

### 4. 環境変数を追加

Vercelダッシュボード → Settings → Environment Variables に追加：

| 変数名 | 値 | 取得方法 |
|--------|----|---------|
| `AUTH_SECRET` | ランダム文字列 | [生成サイト](https://generate-secret.vercel.app/32) で取得 |

※ `DATABASE_URL` は Neon 連携で自動追加されます
※ `AUTH_URL` は Vercel が自動設定するため不要です

### 5. デプロイ

「Deploy」ボタンを押すだけ！  
**ビルド時に自動でDBマイグレーションが実行されます。**

以降は `main` ブランチに push するたびに自動デプロイされます。

---

## ローカル開発手順

```bash
# 1. 依存パッケージをインストール
npm install

# 2. 環境変数を設定
cp .env.local.example .env.local
# .env.local を開き DATABASE_URL と AUTH_SECRET を記入

# 3. マイグレーションファイルを生成（初回 or スキーマ変更時）
npm run db:generate

# 4. 開発サーバー起動（起動時にマイグレーションも自動実行）
npm run dev
```

### 主なコマンド

```bash
npm run dev          # 開発サーバー起動
npm run build        # 本番ビルド（マイグレーションも実行）
npm run db:generate  # マイグレーションファイル生成
npm run db:migrate   # マイグレーション手動実行
npm run db:studio    # Drizzle Studio (DBのGUI)
```

---

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx                        # ダッシュボード
│   ├── layout.tsx
│   ├── api/auth/[...nextauth]/route.ts
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── companies/
│   │   ├── page.tsx                    # 企業一覧
│   │   ├── new/page.tsx
│   │   └── [id]/
│   │       ├── page.tsx                # 企業詳細
│   │       ├── edit/page.tsx
│   │       └── memos/
│   │           ├── new/page.tsx
│   │           └── [memoId]/page.tsx
│   └── tags/page.tsx
├── actions/
│   ├── auth.ts
│   ├── companies.ts
│   ├── tags.ts
│   └── memos.ts
├── components/
│   └── Sidebar.tsx
├── db/
│   ├── index.ts
│   ├── schema.ts
│   └── migrate.ts
├── auth.ts
└── middleware.ts
```
