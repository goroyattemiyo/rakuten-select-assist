# SETUP

最終更新: 2026-04-01

## 1. 概要
このプロジェクトは、楽天アフィリエイト利用者向けに
「商品選定に時間がかかりすぎる問題」を解決するための
Webアプリ MVP です。

現時点では、以下の導線が存在します。

- `/search` : 接続済み検索導線
- `/live-results` : 実検索ベースの結果画面
- `/genre-search` : genreId ベースの改善版検索導線
- `/genre-results` : genreId ベースの結果画面

## 2. 前提環境
- Node.js 22 系推奨
- npm
- 楽天 Web Service の Application ID
- 任意で楽天 Affiliate ID

## 3. 環境変数
`.env.example` を参考に `.env.local` を作成します。

例:

```bash
cp .env.example .env.local
```

設定する値:

```env
RAKUTEN_APPLICATION_ID=your_rakuten_application_id
RAKUTEN_AFFILIATE_ID=your_rakuten_affiliate_id
NEXT_PUBLIC_APP_NAME=Rakuten Select Assist
```

## 4. セットアップ手順
依存をインストールします。

```bash
npm install
```

開発サーバーを起動します。

```bash
npm run dev
```

ブラウザで開きます。

```text
http://localhost:3000
```

## 5. まず確認する画面
現時点で実際に試しやすいのは次の画面です。

### 接続済みの検索画面
```text
http://localhost:3000/search
```

### genreId ベースの改善版検索画面
```text
http://localhost:3000/genre-search
```

## 6. GitHub Actions
最小の CI workflow を追加済みです。

対象ファイル:
- `.github/workflows/ci.yml`

現在の実行内容:
- `npm install`
- `npm run lint`
- `npm run build`

## 7. 現時点の注意点
- `/` は初期モック画面のままです
- `/results` もモック寄りの旧画面です
- 実際に試す場合は `/search` または `/genre-search` を使ってください
- 楽天 API キー未設定だと検索は失敗します
- 投稿文生成機能はまだ未実装です

## 8. 次の優先事項
- トップ導線を `/genre-search` へ統合
- genreId のジャンル定義を拡張
- スコアリングに季節性やギフト適性を追加
- README 本体へこの内容を反映
