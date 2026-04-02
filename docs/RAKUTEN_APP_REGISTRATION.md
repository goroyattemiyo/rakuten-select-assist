# 楽天 Web Service アプリ登録メモ

最終更新: 2026-04-01

## 1. 目的
このドキュメントは、Rakuten Select Assist の開発用に
楽天 Web Service の Application ID と Affiliate ID を取得する際の入力例をまとめたものです。

## 2. 登録時の入力例

### Application name
```text
Rakuten Select Assist
```

### Application URL
ローカル確認のみの場合:
```text
http://localhost:3000
```

公開予定がある場合の例:
```text
https://rakuten-select-assist.vercel.app
```

### Application type
```text
Web Application
```

### Allowed websites
ローカル確認のみの場合:
```text
http://localhost:3000
```

ローカル + 公開予定がある場合の例:
```text
http://localhost:3000
https://rakuten-select-assist.vercel.app
```

### Purpose of data usage
```text
This application helps affiliate users discover Rakuten Ichiba products more efficiently by searching, filtering, and ranking product candidates based on user-selected categories and keywords. The retrieved product information is used to display recommended candidates and support content planning for affiliate posts.
```

### Expected QPS
```text
1
```

## 3. 取得後に使う値
取得後は、以下を `.env.local` に設定します。

```env
RAKUTEN_APPLICATION_ID=your_rakuten_application_id
RAKUTEN_AFFILIATE_ID=your_rakuten_affiliate_id
NEXT_PUBLIC_APP_NAME=Rakuten Select Assist
```

## 4. 注意
- MVP では、これらの値は運営側で管理し、一般ユーザーには取得させない前提です。
- 楽天 Web Service 利用時は、必要に応じてクレジット表示要件も確認してください。
- 公開URLが確定したら Application URL / Allowed websites を更新してください。
