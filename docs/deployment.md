# Deployment Guide

## Overview

このプロジェクトは **GitHub push → 自動ビルド → FTPデプロイ** の流れで本番環境にデプロイされます。

## Setup Steps

### 1. GitHub Secrets の設定

GitHub リポジトリ → **Settings** → **Secrets and variables** → **Actions** に以下を追加：

| Secret名 | 内容 |
|---|---|
| `FTP_HOST` | FTPサーバーアドレス（例: matches.jp） |
| `FTP_USERNAME` | FTPユーザー名 |
| `FTP_PASSWORD` | FTPパスワード |

### 2. Variables の設定

GitHub リポジトリ → **Settings** → **Secrets and variables** → **Variables** → **Actions** に追加：

| Variable名 | 内容 |
|---|---|
| `PUBLIC_URL` | 本番URL（例: https://matchses.jp） |

## Deploy Flow

```
[Local] git push
    ↓
[GitHub Actions] npm run build
    ↓
[GitHub Actions] FTP upload
    ↓
[CORESERVER] dist/ フォルダに展開
```

## Important Rules

### 機密情報の管理
- **絶対にコミットしない**: Stripe シークレット、FTPパスワード、APIキー
- 環境変数は **GitHub Secrets** に登録
- `.env` ファイルは `.gitignore` 済み（安全）

### ステージング確認
1. 開発者はローカルで `npm run dev` 確認
2. 問題なければ `git push` → GitHub Actionsが自動ビルド
3. FTPデプロイ後、レンタルサーバーで直接確認
4. 本番URLで最終確認

### 本番デプロイ前の確認事項
- [ ] `.env` 以外の変更は全てGit管理下にある
- [ ] ビルドエラーがない
- [ ] ステージング環境で動作確認済み

## Stripe Keys の管理

Stripe関連の設定（Secret Key, Webhook Secret）はPHP APIファイルで以下のように参照：
```php
$stripeSecretKey = $_SERVER['STRIPE_SECRET_KEY'] ?? getenv('STRIPE_SECRET_KEY');
```

環境変数は **レンタルサーバーのPHP設定** または **起動スクリプト** で設定してください。