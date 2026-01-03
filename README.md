# My Focus Tube 🎬✨

あなた専用の動画サンクチュアリ。選りすぐりのクリエイターの動画だけを、心穏やかに楽しめる場所です。

## 🚀 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を記述してください：

```env
NEXT_PUBLIC_YOUTUBE_API_KEY=your_api_key_here
```

**手順:**
1. プロジェクトルート（`package.json`がある場所）に `.env.local` ファイルを新規作成
2. 上記の内容をコピー＆ペースト
3. `your_api_key_here` の部分を実際のYouTube Data API v3のAPIキーに置き換え

⚠️ **重要**: 
- `.env.local` ファイルは Git にコミットされません（`.gitignore` に含まれています）
- APIキーは絶対に公開リポジトリにコミットしないでください

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

## 📦 ビルドとデプロイ

### ビルド

```bash
npm run build
```

### 本番環境での起動

```bash
npm start
```

### Vercelへのデプロイ

1. [Vercel](https://vercel.com) にアカウントを作成
2. GitHubリポジトリを接続
3. 環境変数 `NEXT_PUBLIC_YOUTUBE_API_KEY` を設定
4. デプロイ！

## 🎨 機能

- ✅ 6つのお気に入りチャンネルから最新動画を自動取得
- ✅ チャンネルフィルター機能
- ✅ モーダル内での動画再生
- ✅ レスポンシブデザイン（スマホ・PC対応）
- ✅ 美しいアニメーションとホバーエフェクト
- ✅ API Quota節約（Search API不使用）

## 🛠️ 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Date Formatting**: date-fns

## 📝 注意事項

- YouTube Data API v3 の Quota を節約するため、`Search: list` API は使用していません
- 代わりに、各チャンネルのアップロード済みプレイリストから動画を取得しています
- API キーは必ず環境変数で管理してください

## 🎯 対象チャンネル

1. Mark Rober
2. Ryan Trahan
3. Crunchyroll Collection
4. Crunchyroll
5. The Daily Show
6. BBC Earth

---

心穏やかに、ワクワクしながら、あなただけの動画を楽しんでください 🎉

