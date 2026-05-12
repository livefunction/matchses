# MATCHS Deployment Guide

## Overview

このプロジェクトは **Astro SSG** ベースの静的ウェブサイトです。
GitHub push → Playwrightテスト → FTPデプロイ → CoreServer の流れで運用します。

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Development Flow                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  [Local]          [GitHub]        [GitHub Actions]   [CoreServer]
│     │                 │                  │                  │
│     ├── git push ───►│                  │                  │
│     │                ├── trigger ─────► │                  │
│     │                │                  │                  │
│     │                │         [Build & Test]              │
│     │                │                  │                  │
│     │                │                  ├── FTP upload ───► │
│     │                │                  │                  │
│     │                │                  │            [Live!]
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USERNAME/matchses.git
cd matchsess
npm install
```

### 2. ローカル開発

```bash
# 開発サーバー起動
npm run dev

# ブラウザで http://localhost:4321 を確認
```

### 3. テスト実行

```bash
# Playwrightインストール（初回）
npx playwright install chromium

# テスト実行
npm test

# UIモードでテスト（ブラウザ表示）
npm run test:ui
```

### 4. 本番ビルド

```bash
npm run build
# dist/ フォルダに静的ファイルが生成
```

### 5. プレビュー

```bash
npm run preview
# http://localhost:4321 で本番ビルドをプレビュー
```

## GitHub Actions Setup

### Secrets の設定

GitHub リポジトリ → **Settings** → **Secrets and variables** → **Actions**

| Secret名 | 説明 | 取得方法 |
|----------|------|----------|
| `FTP_HOST` | FTPサーバーアドレス | CoreServer管理画面 |
| `FTP_USERNAME` | FTPユーザー名 | CoreServer管理画面 |
| `FTP_PASSWORD` | FTPパスワード | CoreServer管理画面 |

### Variables の設定

| Variable名 | 値 |
|------------|-----|
| `PUBLIC_URL` | `https://matchses.jp` |

### Deploy Flow

1. `main` ブランチに push
2. Playwrightテストが自動実行
3. テスト成功后、dist/をFTPアップロード
4. CoreServerの`/public_html/matchses/`に展開

## Local Test Commands

```bash
# 全テスト実行
npm test

# 特定のテストだけ
npx playwright test tests/e2e.spec.js --grep "quiz"

# ヘッドレスモードで
npx playwright test --project=chromium

# デバッグモード
npx playwright test --debug

# スクリーンショット保存
npx playwright test --screenshot=on
```

## CoreServer FTP Settings

| 項目 | 値 |
|------|-----|
| ホスト | matches.jp（例） |
| ポート | 21 |
| モード | パッシブ |
| パス | /public_html/matchses/ |

## Important Rules

### 絶対遵守

1. **機密情報をコミットしない**
   - `.env` は `.gitignore` 済み
   - Stripe Secret Keys は GitHub Secrets に登録

2. **dist/ をコミットしない**
   - `.gitignore` で除外済み
   - GitHub Actions で自動生成

3. **禁止コマンド**
   - `docker compose down`
   - `docker compose build --no-cache`
   - `docker system prune -a`

### デプロイ前チェック

- [ ] `npm run build` が成功
- [ ] `npm run preview` で確認
- [ ] Playwrightテストが全て成功
- [ ] commit message が明確

## File Structure

```
matchses/
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CDパイプライン
├── .skills/
│   └── deployment.md       # デプロイスキル定義
├── tests/
│   └── e2e.spec.js         # Playwrightテスト
├── src/
│   ├── pages/              # ページ
│   ├── components/         # コンポーネント
│   └── layouts/             # レイアウト
├── dist/                   # ビルド成果物（生成）
├── playwright.config.js    # Playwright設定
└── package.json
```

## Troubleshooting

### ビルドエラー

```bash
rm -rf node_modules
npm install
npm run build
```

### FTPアップロード失敗

```bash
# 接続テスト
ftp FTP_HOST
# 資格情報を手動入力して確認
```

### Playwrightテスト失敗

```bash
# 詳細ログ
npx playwright test --reporter=list --trace=on

# 特定 браузерでテスト
npx playwright test --project=chromium
```

## Related Documents

- `.skills/deployment.md` - デプロイスキルの詳細定義
- `AGENTS.md` - AIエージェント共通ルール