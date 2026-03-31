# CHANGELOG

このファイルでは、プロジェクトの主要な変更履歴を記録します。

## 2026-03-31

### docs
- README を追加
- 開発ルール `docs/RULES.md` を追加
- 開発計画 `docs/DEVELOPMENT_PLAN.md` を追加
- 設計判断ログ `docs/DECISIONS.md` を追加
- 要件定義 `docs/REQUIREMENTS.md` を追加
- 設計書 `docs/DESIGN.md` を追加
- バックログ `BACKLOG.md` を追加

### setup
- `.env.example` を追加
- `package.json` を追加
- `tsconfig.json` を追加
- `next.config.ts` を追加
- `next-env.d.ts` を追加
- Next.js App Router の最小構成を追加

### app
- `app/layout.tsx` を追加
- `app/globals.css` を追加
- `app/page.tsx` を追加
- `app/results/page.tsx` を追加
- `app/api/search/route.ts` を追加
- 接続済みの検索画面 `app/search/page.tsx` を追加
- 実検索結果画面 `app/live-results/page.tsx` を追加

### lib
- 共通型 `lib/types.ts` を追加
- スコアリング `lib/scoring.ts` を追加
- 選定理由生成 `lib/reason.ts` を追加
- 楽天検索クライアント `lib/rakuten.ts` を追加
- 改良版検索クライアント `lib/rakuten-search.ts` を追加

### notes
- MVP は楽天市場向け Web アプリとして開始
- 投稿文生成機能は後回し
- 直近の優先事項は検索精度改善（genreId 対応、フィルタ強化、レスポンス最適化）
