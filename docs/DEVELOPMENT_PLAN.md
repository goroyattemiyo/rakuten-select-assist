# DEVELOPMENT PLAN

最終更新: 2026-04-02

## 現在のフェーズ
MVP完成・公開済み

## ゴール
楽天アフィリエイト利用者向けに、
「商品選定に時間がかかりすぎる問題」を解決する
WebアプリMVPを定義し、実装完了。Vercelで一般公開済み。

## 現在決まっていること
- 初期対象は楽天市場
- 初期提供形態はWebアプリ
- MVPは商品選定支援に特化
- AI APIは後付け候補
- GitHubで管理・Vercelでデプロイ済み
- 公開URL: https://rakuten-select-assist.vercel.app

## 完了済み
- 楽天API新エンドポイント対応（openapi.rakuten.co.jp）
- スコアリング（価格40% + レビュー60%、内訳表示）
- 選定候補表示（スコアバッジ・検索条件サマリー）
- warm glowデザイン（Tailwind v4）
- Vercelデプロイ・本番稼働
- 保存機能（localStorage）
- 投稿文生成・コピー機能
- アプリアイコン設置
- 旧ページ削除（genre-search, genre-results, live-results, search）
- 旧APIファイル削除（rakuten.ts, rakuten-search.ts, rakuten-genre-search.ts, reason.ts）
- API統合（rakuten-unified.ts）

## 未完了・次フェーズ候補
- スコアリング改良（季節性・ギフト適性）
- ローディングスケルトン表示
- AI API連携（投稿文自動生成）
- Threads投稿補助
- 本番OriginヘッダーのVercel設定確認
- 不要ライブラリ整理

## 次にやること
1. スコアリング改良
2. AI投稿文生成
3. CI強化（型チェック・テスト追加）
