# DECISIONS

## 2026-04-02: 楽天API新エンドポイント移行

### 背景
楽天ウェブサービスが2026年2月10日より新APIへの移行を開始。
旧ドメイン（app.rakuten.co.jp）は2026年5月14日に完全停止予定。
移行期間は2026年2月10日〜5月13日。

### 問題の経緯

#### 最初の症状
- `app.rakuten.co.jp` の旧エンドポイントで `400 wrong_parameter` が返り続けた
- Application IDが `UUID形式` であることを疑い、何度も確認したが正常だった

#### 試みたこと（失敗）
1. Application IDをAccess Keyに変えて送信 → 同じ400エラー
2. Application URLを `http://localhost:3000` に変更 → 変化なし
3. 新アプリを作成して新しいApplication IDを取得 → 同じ400エラー
4. `Referer` ヘッダーを追加 → 403に変わったが解決せず
5. 新エンドポイント（openapi.rakuten.co.jp）に切り替え → 403 `REQUEST_CONTEXT_BODY_HTTP_REFERRER_MISSING`
6. `Referer` ヘッダーを小文字に変更 → 変化なし
7. ブラウザで直接新エンドポイントにアクセス → 同じ403

#### 解決のきっかけ
- 楽天APIテストフォームで成功したURLを確認し、新エンドポイントと `accessKey` が必要と判明
- 他の開発者の記事から `Origin` ヘッダーが必要と判明

#### 根本原因
- 旧APIは2026年2月以降、UUID形式のApplication IDを受け付けなくなっていた
- 新APIは `applicationId` + `accessKey` の両方が必須
- サーバーサイドからのリクエストでも `Origin` ヘッダーを付けないと403になる
- `Referer` だけでは不十分で `Origin` が必須だった

### 決定事項
- エンドポイントを新ドメインへ移行する
  - 旧: `https://app.rakuten.co.jp/services/api/IchibaItem/Search/20220601`
  - 新: `https://openapi.rakuten.co.jp/ichibams/api/IchibaItem/Search/20220601`
- 認証に `applicationId` に加えて `accessKey` が必須
- リクエストヘッダーに `Origin` と `Referer` を付ける
  - 値は楽天管理画面の「Allowed websites」に登録したドメインを指定する
- `mediumImageUrls` のレスポンス型が変わった
  - 旧: `Array<{ imageUrl: string }>`（オブジェクト配列）
  - 新: `string[]`（文字列配列）

### 影響ファイル
- `lib/rakuten.ts`
- `.env.local`（`RAKUTEN_ACCESS_KEY` を追加）

### 環境変数
- `RAKUTEN_APPLICATION_ID`: UUID形式のアプリID
- `RAKUTEN_ACCESS_KEY`: アクセスキー
- `RAKUTEN_AFFILIATE_ID`: アフィリエイトID

### 今後の注意点
- Vercelデプロイ時は環境変数に `RAKUTEN_ACCESS_KEY` を追加すること
- `Origin` ヘッダーの値は本番では本番ドメインに変更すること
- `lib/rakuten-genre-search.ts` と `lib/rakuten-search.ts` も同様の修正が必要

---

## 2026-04-02: MVP完成・旧ファイル整理

### 完了した作業
- Stitch（Google）でデザイン生成・Next.jsに適用
- Tailwind v4導入（@tailwindcss/postcss）
- warm glowグラデーション背景
- 保存機能（localStorage）実装
- 投稿文生成・コピー機能実装
- Vercelデプロイ完了
- 旧ページ4件削除
- 旧APIファイル3件 + reason.ts 削除

### 技術判断
- 投稿文URLは非表示にして「プロフィールから」に変更（SNS投稿の慣習に合わせた）
- 保存データ型にreviewCount/reviewAverageを追加
- useSearchParamsはSuspenseでラップ必須（Next.js App Router）

### 現在のファイル構成（lib/）
- rakuten-unified.ts: 楽天API統合クライアント
- saved-items.ts: localStorage保存管理
- post-generator.ts: 投稿文生成
- scoring.ts: スコアリング
- types.ts: 型定義
- genre-catalog.ts: ジャンル一覧

---

## 2026-04-02: AI機能実装（Gemini API）

### 実装内容
- AI投稿文生成：`app/api/generate-post/route.ts`
- AIキーワード提案：`app/api/suggest-keywords/route.ts`

### 技術判断
- GeminiAPIを採用（無料枠あり）
- モデル：`gemini-2.5-flash-lite`（安定・高速・1日1000リクエスト）
- `gemini-2.5-flash`は無料枠20回/日で不足、タイムアウトも発生
- キーワード提案はJSON形式をやめてプレーンテキストでパース
- Vercelタイムアウト対策：`vercel.json`で30秒に延長

### 環境変数
- `GEMINI_API_KEY`：Vercel・`.env.local`両方に設定済み
