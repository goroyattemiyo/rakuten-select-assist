# Rakuten Select Assist

楽天アフィリエイト利用者向けに、
「商品選定に時間がかかりすぎる問題」を解決するための
商品選定支援 Web アプリです。

## 現在の状態
このリポジトリは MVP 開発中です。

現時点で利用しやすい導線:
- `/search` : 接続済み検索導線
- `/live-results` : 実検索ベースの結果画面
- `/genre-search` : genreId ベースの改善版検索導線
- `/genre-results` : genreId ベースの結果画面

## セットアップ
### 1. 前提
- Node.js 22 系推奨
- npm
- 楽天 Web Service の Application ID
- 任意で楽天 Affiliate ID

### 2. 環境変数を設定
`.env.example` を参考に `.env.local` を作成します。

```bash
cp .env.example .env.local
```

設定例:

```env
RAKUTEN_APPLICATION_ID=your_rakuten_application_id
RAKUTEN_AFFILIATE_ID=your_rakuten_affiliate_id
NEXT_PUBLIC_APP_NAME=Rakuten Select Assist
```

### 3. 依存をインストール
```bash
npm install
```

### 4. 開発サーバーを起動
```bash
npm run dev
```

### 5. ブラウザで確認
```text
http://localhost:3000
```

## まず確認する画面
### 接続済み検索画面
```text
http://localhost:3000/search
```

### genreId ベースの改善版検索画面
```text
http://localhost:3000/genre-search
```

## GitHub Actions
最小の CI workflow を追加済みです。

内容:
- `npm install`
- `npm run lint`
- `npm run build`

workflow:
- `.github/workflows/ci.yml`

## ドキュメント
- `docs/RULES.md`
- `docs/DEVELOPMENT_PLAN.md`
- `docs/DECISIONS.md`
- `docs/REQUIREMENTS.md`
- `docs/DESIGN.md`
- `docs/SETUP.md`
- `CHANGELOG.md`
- `docs/worklogs/`

## 現時点の注意点
- `/` は初期モック画面のままです
- `/results` もモック寄りの旧画面です
- 実際に試す場合は `/search` または `/genre-search` を使ってください
- 楽天 API キー未設定だと検索は失敗します
- 投稿文生成機能はまだ未実装です

## 次の優先事項
- トップ導線を `/genre-search` へ統合
- genreId のジャンル定義を拡張
- スコアリングに季節性やギフト適性を追加
- 投稿用プロンプト出力の仕様設計
