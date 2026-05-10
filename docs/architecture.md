# MATCHS サイト構成案

> CORESERVER レンタルサーバー対応 / WordPress 不使用 / Stripe 決済

---

## 1. 基本方針

| 項目 | 採用技術 | 理由 |
|---|---|---|
| フロントエンド | Astro（Static Site Generator） | ビルド結果が純粋な HTML/CSS/JS。レンタルサーバーで完璧に動作。初期表示速度は WordPress の 3〜5 倍。 |
| バックエンド API | PHP（最小構成） | CORESERVER レンタルサーバー標準搭載。Node.js 不要。Stripe SDK for PHP で決済連携可能。 |
| データベース | MySQL | レンタルサーバー付属。予約・商品・店舗データを管理。 |
| 決済 | Stripe Checkout（ホスト型） | カード入力フォーム不要。PCI コンプライアンス不要。多通貨・Apple Pay・Google Pay 対応。 |
| 画像 | WebP 変換後、レンタルサーバー配置 | 初期は外部ストレージ不要。Cloudinary 移行も後から容易。 |

---

## 2. システムアーキテクチャ

```
[ ユーザー（海外/スマホ） ]
         ↓
[ Cloudflare（DNS + CDN）] ← オススメ（速度・セキュリティ向上）
         ↓
[ CORESERVER レンタルサーバー ]
         ├── /index.html … Astro 静的ファイル（フロント）
         ├── /experiences/ … 体験商品ページ
         ├── /api/*.php … PHP API（決済・予約）
         ├── /admin/ … 管理画面（後 Phase）
         └── /assets/ … 画像・CSS・JS
         ↓
[ MySQL（レンタルサーバー内）]
         ↓
[ Stripe API（外部）]
```

### Astro を選ぶ決め手

- **レンタルサーバーで最速**: Node.js 実行環境不要。ビルド時に HTML を生成し、アップロードするだけ。
- **部分的水合化（Partial Hydration）**: インタラクティブな予約フォームだけ React/Vue/Svelte で動的化。他は静的 HTML。
- **SEO 最強**: Core Web Vitals（LCP, CLS）を容易に満たす。
- **多言語対応（後 Phase）**: `astro-i18n` で `/en/`, `/ja/` 構成が自然に作れる。

---

## 3. ディレクトリ構成（開発時）

```
matchses/
├── docs/
│   └── architecture.md          # 本ドキュメント
├── sql/
│   └── init.sql                 # MySQL テーブル定義
├── src/                         # Astro ソースコード
│   ├── layouts/
│   │   └── BaseLayout.astro     # 共通レイアウト（ヘッダー/CTA/フッター）
│   ├── components/
│   │   ├── ui/
│   │   │   ├── FixedCta.astro   # 画面下部固定 CTA
│   │   │   ├── TrustBadge.astro # 安心文言バッジ
│   │   │   └── PriceTag.astro   # 価格表示
│   │   ├── booking/
│   │   │   ├── DatePicker.astro # 日付選択（Vanilla JS）
│   │   │   ├── GuestCounter.astro # 人数カウンター
│   │   │   └── BookingForm.astro  # 予約フォーム全体
│   │   └── experience/
│   │       ├── Hero.astro       # 商品ページ Hero
│   │       ├── InfoBar.astro    # ⏱時間 / 🌐言語 / 📍場所
│   │       ├── ReviewScore.astro # ⭐評価
│   │       └── PhotoGallery.astro # 写真ギャラリー
│   ├── pages/
│   │   ├── index.astro          # TOP ページ
│   │   ├── experiences/
│   │   │   ├── mt-takao-local-food-tour.astro
│   │   │   ├── best-izakaya-tachikawa.astro
│   │   │   └── onsen-day-trip-tama.astro
│   │   └── booking/
│   │       └── confirm.astro    # 予約確認・決済完了
│   └── styles/
│       └── global.css           # Tailwind or 独自 CSS
├── api/                         # PHP API（レンタルサーバー配置用）
│   ├── config.php               # DB接続・Stripeキー管理
│   ├── checkout.php             # Stripe Checkout セッション作成
│   ├── subscription.php         # Stripe Subscription セッション作成
│   ├── booking.php              # 予約データ保存
│   └── webhook.php              # Stripe Webhook 受信
└── dist/                        # Astro ビルド出力 → これをレンタルサーバーにアップ
```

---

## 4. ページ構成

### 4.1 TOP ページ（`/`）

| セクション | 内容 |
|---|---|
| Hero | 「Discover Hidden Tokyo West」+ [Explore Now] |
| カテゴリ横スクロール | Mt. Takao / Food Tours / Onsen / Family Friendly / Nightlife |
| 人気体験カード（3枚） | 写真 / タイトル / ⭐評価 / 時間 / 価格 / [Book Now] |
| BtoB CTA | 「Get More Foreign Visitors」+ [Join MATCHS] |
| 安心バッジ | Free cancellation / Instant confirmation / English support / Secure payment |

### 4.2 体験商品ページ（`/experiences/xxx`）

**共通構造（3タップ以内で予約完了）**

| 要素 | 内容 |
|---|---|
| Hero 画像 | フル幅、高品質写真 |
| タイトル・評価 | Mt. Takao Local Food Tour / ⭐ 4.8 (32 Reviews) |
| Info Bar | ⏱ 3 Hours / 🌐 English OK / 📍 Tokyo Tama |
| 価格 | ¥4,980 / person（即表示） |
| 固定 CTA | 画面下部常時「¥4,980 [Book Now]」 |
| 概要テキスト | 英語で自然な説明文（150 words 以内） |
| 含まれるもの | What's Included（箇条書き） |
| スケジュール | 時間軸での流れ |
| キャンセルポリシー | Free cancellation up to 24h（明示） |
| レビュー | 3件程度表示 |
| サポート | WhatsApp / LINE リンク |

### 4.3 決済完了ページ（`/booking/confirm`）

| 要素 | 内容 |
|---|---|
| 完了メッセージ | Booking Confirmed 🎉 |
| メール案内 | We sent details to your email. |
| 予約詳細 | 日付・人数・体験名 |
| サポート | WhatsApp Support / LINE Support |

---

## 5. UI/UX 設計（外国人向け・離脱防止）

### 5.1 色設計

```
背景: #FFFFFF（白ベース）
文字: #1A1A1A（黒に近いグレー）
CTA: #10B981（緑）or #2563EB（青）※ Airbnb 系に慣れている外国人向け
アクセント: #F59E0B（オレンジ・評価星など）
境界線: #E5E7EB（薄グレー）
```

### 5.2 タイポグラフィ

- **英文**: Inter, Helvetica Neue, system-ui（サンセリフ）
- **和文**: Noto Sans JP
- **サイズ**: 16px base / Hero 32px / 価格 24px bold

### 5.3 CTA 設計（最重要）

```
┌─────────────────────────────┐
│  ¥4,980 / person            │
│  [      Book Now            │
│         （緑・角丸12px）]   │
└─────────────────────────────┘
         ↑ 画面下部固定（z-index: 50）
```

- スクロール中も常に表示
- タップエリア: 横幅 90% 以上、高さ 56px 以上
- 色: 緑（#10B981）。白文字。Shadow 付きで浮き上がる。

### 5.4 安心バッジ（CTA 直上に配置）

```
🛡 Free cancellation up to 24h
⚡ Instant confirmation
🌐 English support available
🔒 Secure payment by Stripe
```

### 5.5 予約フォーム（1 画面完結）

```
Select Date
[ May 12 ▼ ]

Guests
[-] 2 [+]

Name
[________________]

Email
[________________]

WhatsApp (optional)
[________________]

[ Continue to Payment ]
```

- 入力項目は **4 つ以内**
- 電話番号不要
- 住所不要
- 会員登録不要

---

## 6. データベース設計（MySQL）

### 6.1 テーブル一覧

```sql
-- 体験商品
CREATE TABLE experiences (
    id INT PRIMARY KEY AUTO_INCREMENT,
    slug VARCHAR(100) UNIQUE NOT NULL,          -- URL用: mt-takao-local-food-tour
    title_en VARCHAR(255) NOT NULL,             -- 英語タイトル
    title_ja VARCHAR(255),                      -- 日本語タイトル（管理用）
    description TEXT,                           -- 説明文
    duration VARCHAR(50),                       -- 例: "3 Hours"
    location VARCHAR(100),                      -- 例: "Tokyo Tama"
    price_per_person INT NOT NULL,              -- 例: 4980
    max_guests INT DEFAULT 10,                  -- 最大人数
    category ENUM('food','nature','onsen','family','nightlife'),
    image_hero VARCHAR(255),                    -- Hero画像パス
    rating DECIMAL(2,1) DEFAULT 4.5,            -- 評価
    review_count INT DEFAULT 0,                 -- レビュー数
    cancellation_policy VARCHAR(255),           -- 例: "Free up to 24h"
    is_active BOOLEAN DEFAULT TRUE,
    stripe_price_id VARCHAR(100),               -- Stripe Price ID（単発決済用）
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 店舗（掲載事業者）
CREATE TABLE merchants (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    whatsapp VARCHAR(50),
    listing_type ENUM('standard','premium','featured') DEFAULT 'standard',
    stripe_subscription_id VARCHAR(100),        -- Stripe Subscription ID
    subscription_status ENUM('active','cancelled','past_due') DEFAULT 'active',
    monthly_fee INT DEFAULT 9800,               -- 月額掲載料
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 予約
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    experience_id INT NOT NULL,
    guest_name VARCHAR(255) NOT NULL,
    guest_email VARCHAR(255) NOT NULL,
    guest_whatsapp VARCHAR(50),
    booking_date DATE NOT NULL,
    guest_count INT NOT NULL,
    total_amount INT NOT NULL,                  -- 合計金額
    stripe_session_id VARCHAR(255),             -- Stripe Checkout Session ID
    stripe_payment_status ENUM('unpaid','paid','cancelled') DEFAULT 'unpaid',
    status ENUM('pending','confirmed','cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (experience_id) REFERENCES experiences(id)
);

-- 決済（監査用）
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT,
    stripe_session_id VARCHAR(255),
    stripe_payment_intent_id VARCHAR(255),
    amount INT NOT NULL,
    currency VARCHAR(3) DEFAULT 'jpy',
    status VARCHAR(50),
    paid_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id)
);
```

---

## 7. Stripe 連携設計（PHP API）

### 7.1 必要な API エンドポイント（最小構成）

| エンドポイント | 役割 | 認証 |
|---|---|---|
| `POST /api/checkout.php` | 体験予約の Checkout Session を作成 | 不要（ゲスト利用） |
| `POST /api/subscription.php` | 店舗掲載料の Subscription Session を作成 | 不要（ゲスト利用→Stripe管理） |
| `POST /api/webhook.php` | Stripe からの決済完了・失敗を受信 | Stripe Signature 検証 |
| `POST /api/booking.php` | 予約データを DB に保存 | 不要 |

### 7.2 決済フロー（体験予約）

```
[ユーザー]
   │
   ▼
[Book Now] タップ
   │
   ▼
Astro フロント：日付・人数・Email を入力
   │
   ▼
POST /api/checkout.php
（PHP が Stripe Checkout Session を作成）
   │
   ▼
Stripe Checkout ページへリダイレクト
（ユーザーが Apple Pay / Card / Google Pay で支払い）
   │
   ▼
支払い成功 → Stripe が webhook.php をコール
   │
   ▼
PHP：booking ステータスを "confirmed" に更新
   │
   ▼
Stripe Checkout Success URL → /booking/confirm?session_id=xxx
   │
   ▼
Astro：完了画面を表示 + メール送信（PHP mail or SendGrid API）
```

### 7.3 checkout.php の概要

```php
<?php
require 'vendor/autoload.php'; // Stripe PHP SDK
\Stripe\Stripe::setApiKey($_ENV['STRIPE_SECRET_KEY']);

$session = \Stripe\Checkout\Session::create([
    'payment_method_types' => ['card'],
    'line_items' => [[
        'price_data' => [
            'currency' => 'jpy',
            'product_data' => ['name' => $experience_title],
            'unit_amount' => $price_per_person,
        ],
        'quantity' => $guest_count,
    ]],
    'mode' => 'payment',
    'success_url' => 'https://matchses.jp/booking/confirm?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => 'https://matchses.jp/experiences/' . $slug,
    'customer_email' => $guest_email,
]);

// DB に仮予約を保存（status: pending）
// ...

header('Location: ' . $session->url);
exit;
```

### 7.4 サブスク課金（店舗向け）フロー

```
[店舗オーナー]
   │
   ▼
[JOIN MATCHS] → 掲載プラン選択
   │
   ▼
POST /api/subscription.php
   │
   ▼
Stripe Checkout（Subscription モード）
   │
   ▼
支払い成功 → webhook で merchants テーブル更新
   │
   ▼
管理画面へアクセス可能に
```

```php
// subscription.php（概要）
$session = \Stripe\Checkout\Session::create([
    'mode' => 'subscription',
    'line_items' => [[
        'price' => $stripe_price_id, // Standard: 9800円/月
    ]],
    'success_url' => 'https://matchses.jp/admin/onboarding?session_id={CHECKOUT_SESSION_ID}',
    'cancel_url' => 'https://matchses.jp/for-merchants',
]);
```

---

## 8. 初期 3 ページの構成詳細

### 8.1 Mt. Takao Local Food Tour（`/experiences/mt-takao-local-food-tour`）

```
Hero: 高尾山の自然写真（秋 or 緑）
Title: Mt. Takao Local Food Tour
Rating: ⭐ 4.8 (32 Reviews)
Info: ⏱ 3 Hours / 🌐 English OK / 📍 Tokyo Tama
Price: ¥4,980 / person
CTA: [Book Now]

Overview:
Explore the sacred mountain with a local guide.
Taste traditional soba, mountain yam, and seasonal snacks.
Perfect for first-time visitors.

Includes:
- English-speaking guide
- 3 food tastings
- Round-trip cable car ticket

Schedule:
09:00 Meet at Takaosanguchi Station
09:30 Cable car to the middle
10:00 Forest walk & temple visit
12:00 Lunch at local soba restaurant
13:00 Free time & descent

Cancellation: Free cancellation up to 24 hours before

Reviews:
"Amazing experience! The guide was super friendly." - Sarah, USA
...

Support: WhatsApp / LINE
```

### 8.2 Best Izakaya in Tachikawa（`/experiences/best-izakaya-tachikawa`）

```
Price: ¥6,500 / person（飲み放題込み）
Duration: 2.5 Hours
Guests: 2-6 people
Includes: 5 dishes + 90min free drink
```

### 8.3 Onsen Day Trip Tama（`/experiences/onsen-day-trip-tama`）

```
Price: ¥3,800 / person
Duration: 4 Hours（入浴 + 昼食）
Includes: Onsen ticket + set meal
Option: +¥1,500 for private bath
```

---

## 9. 実装ロードマップ

### Phase 1: MVP（2 週間）

**目標**: 予約が通る最小構成

- [ ] Astro プロジェクトセットアップ + Tailwind CSS
- [ ] TOP ページ（静的）
- [ ] 体験商品ページ 3 ページ（静的）
- [ ] PHP API: `checkout.php`（Stripe Checkout 連携）
- [ ] PHP API: `webhook.php`（決済完了処理）
- [ ] MySQL: `experiences`, `bookings` テーブル
- [ ] 決済完了ページ
- [ ] CORESERVER へアップロード + SSL 設定

**マネタイズ**: 体験販売のみ（単発決済）

### Phase 2: 掲載課金導入（+1 週間）

- [ ] `merchants` テーブル作成
- [ ] PHP API: `subscription.php`（Stripe Subscription）
- [ ] 店舗向け LP（`/for-merchants`）
- [ ] 掲載プラン表示（Standard / Premium / Featured）
- [ ] Webhook でサブスク状態管理

**マネタイズ**: 体験販売 + 店舗掲載料

### Phase 3: 管理画面（+2 週間）

- [ ] 管理画面ログイン（Simple PHP Auth）
- [ ] 予約一覧（`/admin/bookings`）
- [ ] 店舗一覧・掲載状況（`/admin/merchants`）
- [ ] 売上ダッシュボード（簡易グラフ）
- [ ] メール通知機能（予約確定・リマインダー）

### Phase 4: 改善（+2 週間）

- [ ] 多言語対応（英語/日本語/繁体字）
- [ ] 写真最適化（WebP + lazy loading）
- [ ] SEO（Structured Data / OGP）
- [ ] Google Analytics 4 + Conversion 計測
- [ ] Cloudflare 導入（CDN + キャッシュ）

---

## 10. セキュリティ・運用注意点

### Stripe 審査対策

1. **利用規約（Terms of Service）**: 英語で明記
2. **返金ポリシー（Refund Policy）**: キャンセル条件を明示
3. **プライバシーポリシー**: GDPR 対応を意識
4. **連絡先**: 日本の実在する住所・メールを記載

### レンタルサーバー特有の注意

- **PHP バージョン**: 8.1 以上を指定（Stripe SDK 要件）
- **SSL**: 必須（Stripe は HTTPS 必須）
- **.htaccess**: API ディレクトリの適切なアクセス制御
- **バックアップ**: CORESERVER 自動バックアップ + 手動 DB ダンプ

### 環境変数管理

`.env` ファイルはレンタルサーバーに直接配置せず、以下のいずれかで管理：

- CORESERVER コントロールパネルの環境変数設定（あれば）
- `config.php` を `.gitignore` + 手動アップロード
- `$_SERVER` 経由で設定

```php
// config.php（レンタルサーバー上のみ配置）
<?php
$env = [
    'DB_HOST' => 'localhost',
    'DB_NAME' => 'matchses_db',
    'DB_USER' => 'matchses_user',
    'DB_PASS' => 'xxxxxxxx',
    'STRIPE_SECRET_KEY' => 'sk_live_xxxxxxxx',
    'STRIPE_WEBHOOK_SECRET' => 'whsec_xxxxxxxx',
    'STRIPE_PUBLISHABLE_KEY' => 'pk_live_xxxxxxxx',
];
```

---

## 11. 年商 1000 万円への数値設計

| 収益源 | 単価 | 数量/月 | 月額 | 年額 |
|---|---|---|---|---|
| Standard 掲載 | ¥9,800 | 30 店舗 | ¥294,000 | ¥3,528,000 |
| Premium 掲載 | ¥19,800 | 10 店舗 | ¥198,000 | ¥2,376,000 |
| 予約手数料（10%） | 平均 ¥500/件 | 400 件 | ¥200,000 | ¥2,400,000 |
| 自社ツアー販売 | ¥4,980 | 200 件 | ¥996,000 | ¥11,952,000 |
| **合計** | | | **¥1,688,000** | **¥20,256,000** |

※ 自社ツアーが伸びれば、年商 1000 万を超える構成。

---

## 12. 結論：最初に作るもの（優先順位）

1. **Astro 開発環境 + 3 商品ページ**（TOP + Mt.Takao + Izakaya + Onsen）
2. **Stripe Checkout 連携**（PHP API 2 ファイル）
3. **MySQL 初期構築**（テーブル 2 つ）
4. **CORESERVER へデプロイ**（SSL 確認 + 決済テスト）

これで「予約が入る状態」を 2 週間以内に作れます。
