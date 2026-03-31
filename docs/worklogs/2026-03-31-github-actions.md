# Worklog - 2026-03-31 GitHub Actions 追加

## 概要
GitHub Actions が未設定だったため、最小の CI workflow を追加した。

## 追加したファイル
- `.github/workflows/ci.yml`

## 実装内容
- `push` と `pull_request` をトリガーにした
- Node.js 22 を使用
- `npm install` を実行
- `npm run lint` を実行
- `npm run build` を実行

## 意図
- まずは最小の CI を有効化し、明らかな構成エラーやビルドエラーを早期に検知できるようにする
- テストや型チェックは、必要なスクリプト整備後に追加する

## 次の候補
- `package-lock.json` 導入後に `npm ci` へ切り替え
- 型チェックスクリプト追加
- テストスクリプト追加
- Actions の実行結果確認
