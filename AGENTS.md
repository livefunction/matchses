# MATCHS 開発エージェント ルール

---

## 言語ルール

- **日本語で回答**
- ですます調
- 技術用語は英語のまま
- 日本語と英数字の間は半角スペース

---

## 開発環境

| 項目 | 値 |
|------|-----|
| フレームワーク | Astro |
| ビルド | `npm run build` |
| 開発サーバー | `npm run dev` |
| 出力ディレクトリ | `dist/` |

---

## 絶対遵守事項

### 禁止コマンド

| 禁止コマンド | 理由 |
|-------------|------|
| `docker compose down` | 他サービスのコンテナを巻き込む |
| `docker compose build --no-cache` | メモリ压迫、OOM発生の恐れ |
| `docker rm -f` | コンテナ强制削除 |
| `docker system prune -a` | 全Dockerリソース削除 |

### 許可されている操作

- ファイル編集（Astro ソースコード）
- `npm run build` / `npm run dev`
- Git コミット & プッシュ
- pull request 作成
- Playwrightテスト実行（`npm test`）

---

## 開発フロー

1. ローカルで変更・テスト（`npm run build` 確認）
2. `npm test` で Playwright テスト実行
3. Git コミット
4. プッシュ
5. GitHub Actions が自動ビルド & FTPデプロイ

---

## デプロイスキル

デプロイに関する詳細な手順は `.skills/deployment.md` を参照してください。

### 主なコマンド

```bash
# ビルド
npm run build

# プレビュー
npm run preview

# テスト
npm test

# UIモードでテスト
npm run test:ui
```

---

## 毎回実行するチェック

1. 変更対象が「禁止ファイル」でないか確認
2. ポート・ネットワーク変更がないか確認
3. メモリ・リソース制限の変更がないか確認
4. `npm run build` が成功することを確認
5. 必要に応じて `npm test` を実行

---

## 禁止ファイル

| ファイル | 理由 |
|---------|------|
| `.github/workflows/deploy.yml` | デプロイパイプライン |
| `Dockerfile` | ビルド構成 |
| `docker-compose.yml` | 本番構成 |
| `.env` ファイル | 本番環境変数 |

---

## 言語・スタイル

```
正しい例：
- ファイルを保存しました
- npm run build を実行します
- ポート番号は 3000 です

正しくない例：
- ファイルを保存しました。
- npm run buildを実行します。
- ポート番号は3000です。
```