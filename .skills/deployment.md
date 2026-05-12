# Deployment Skill - MATCHS

## 概要
GitHub Actions を使った Astro プロジェクトの CI/CD デプロイパイプライン。

## 環境構成

```
[Local] → [GitHub] → [GitHub Actions] → [CoreServer]
                ↓
          Playwright tests
                ↓
          FTP upload
```

## デプロイの流れ

### 1. ローカル開発

```bash
# 開発開始
npm run dev

# 変更後、ビルド確認
npm run build

# Playwrightでテスト（要インストール）
npx playwright test

# 問題なければコミット
git add .
git commit -m "descriptive message"
git push
```

### 2. GitHub Actions（自動）

```
mainブランチにpush → 自動的に:
1. npm ci（依存関係インストール）
2. npm run build（Astro静的生成）
3. FTPアップロード（CoreServerへ）
```

### 3. 本番確認

CoreServer上の`dist/`フォルダを確認。
サイトにアクセスして最終確認。

## GitHub Secrets の設定

リポジトリ → **Settings** → **Secrets and variables** → **Actions**

| Secret名 | 説明 | 例 |
|----------|------|-----|
| `FTP_HOST` | FTPサーバーアドレス | matches.jp |
| `FTP_USERNAME` | FTPユーザー名 | user@matches.jp |
| `FTP_PASSWORD` | FTPパスワード | ************ |

**Variables（Vars）**

| Variable名 | 説明 | 例 |
|------------|------|-----|
| `PUBLIC_URL` | 本番URL | https://matchses.jp |

## GitHub Actions ワークフロー

`.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          PUBLIC_URL: ${{ vars.PUBLIC_URL }}
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: dist/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/download-artifact@v4
        with:
          name: dist
          path: dist/
      - name: Deploy via FTP
        env:
          FTP_HOST: ${{ secrets.FTP_HOST }}
          FTP_USERNAME: ${{ secrets.FTP_USERNAME }}
          FTP_PASSWORD: ${{ secrets.FTP_PASSWORD }}
        run: |
          # ディレクトリごと再帰アップロード
          apt-get update && apt-get install -y lftp
          lftp -e "set ftp:ssl-allow no; mirror -R dist / ; bye" -u $FTP_USERNAME,$FTP_PASSWORD $FTP_HOST
```

## Playwright テスト設定

### インストール

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### テストファイル例

`tests/e2e.spec.js`:

```javascript
import { test, expect } from '@playwright/test';

test.describe('MATCHS', () => {
  test('homepage loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/MATCHS/);
  });

  test('experiences page', async ({ page }) => {
    await page.goto('/experiences');
    await expect(page.locator('h1')).toContainText('Discover');
  });

  test('quiz flow', async ({ page }) => {
    await page.goto('/quiz');
    await page.click('text=Authentic local food');
    await page.click('text=With a knowledgeable');
    await page.click('text=Full energy');
    await expect(page.locator('.result-title')).toBeVisible();
  });

  test('ask-guide page', async ({ page }) => {
    await page.goto('/ask-guide');
    await expect(page.locator('h1')).toContainText('Ask a Guide');
  });

  test('login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('text=Welcome Back')).toBeVisible();
  });
});
```

### package.json にスクリプト追加

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui"
  }
}
```

## デプロイ前チェックリスト

### コード変更時
- [ ] `npm run build` が成功する
- [ ] `npm run preview` でローカル確認
- [ ] Playwrightテストが全て成功
- [ ] 機密情報が.env以外にあるか確認

### コミット時
- [ ] commit messageが明確（機能名付き）
- [ ] .gitignoreが正しく設定済み
- [ ] ビルド成果物（dist/）はコミットしない

### 本番確認時
- [ ] 本番URLでページが正常表示
- [ ] ナビゲーションが機能する
- [ ] 主要なCTAボタンが動作する

## CoreServer FTP設定

| 項目 | 値 |
|------|-----|
| ホスト | matches.jp（例） |
| ポート | 21 |
| プロトコル | FTP |
| モード | パッシブ |
| パス | /public_html/matchses/ |

## トラブルシューティング

### ビルドエラー
```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
npm run build
```

### FTPアップロード失敗
- FTP資格情報（Secrets）が正しいか確認
- CoreServerのFTPが有効か確認
- ログインテスト: `ftp ftp.example.com`

### Playwrightテスト失敗
```bash
# スクリーンショットを保存
npx playwright test --reporter=list --screenshot=on
```

## 禁止事項

| 禁止コマンド | 理由 |
|-------------|------|
| `docker compose down` | 全コンテナ停止 |
| `docker compose build --no-cache` | メモリ逼迫 |
| `docker system prune -a` | 全リソース削除 |

## 関連ファイル

- `AGENTS.md` - AIエージェント共通ルール
- `.github/workflows/deploy.yml` - CI/CD設定
- `docs/deployment.md` - 詳細手順書
