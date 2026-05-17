<?php
/**
 * MATCHS Configuration Template
 * 
 * このファイルを config.php としてコピーし、実際の値を入力してください。
 * config.php は .gitignore に追加し、Git 管理から除外してください。
 * 
 * CoreServer へは手動アップロード、または GitHub Secrets 経由で配置します。
 */

// 本番環境判定
define('IS_PRODUCTION', ($_SERVER['HTTP_HOST'] ?? '') === 'matchses.com' || 
                        ($_SERVER['HTTP_HOST'] ?? '') === 'www.matchses.com');

// データベース設定
define('DB_HOST', 'localhost');
define('DB_NAME', 'matchses_db');
define('DB_USER', 'matchses_user');
define('DB_PASS', 'xxxxxxxx');
define('DB_CHARSET', 'utf8mb4');

// Stripe 設定
// テスト用: https://dashboard.stripe.com/test/apikeys
// 本番用: https://dashboard.stripe.com/apikeys
define('STRIPE_SECRET_KEY', IS_PRODUCTION ? 'sk_live_xxxxxxxx' : 'sk_test_xxxxxxxx');
define('STRIPE_PUBLISHABLE_KEY', IS_PRODUCTION ? 'pk_live_xxxxxxxx' : 'pk_test_xxxxxxxx');
define('STRIPE_WEBHOOK_SECRET', IS_PRODUCTION ? 'whsec_xxxxxxxx' : 'whsec_xxxxxxxx');

// サイトURL
define('SITE_URL', IS_PRODUCTION ? 'https://matchses.com' : 'http://localhost:4321');

// 通貨
define('CURRENCY', 'jpy');

/**
 * PDO データベース接続を取得
 */
function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = sprintf('mysql:host=%s;dbname=%s;charset=%s', DB_HOST, DB_NAME, DB_CHARSET);
        $pdo = new PDO($dsn, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
    }
    return $pdo;
}

/**
 * JSON レスポンスを返す
 */
function jsonResponse(array $data, int $status = 200): void {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . SITE_URL);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/**
 * プリフライトリクエストを処理
 */
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: ' . SITE_URL);
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    http_response_code(204);
    exit;
}
