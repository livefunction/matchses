<?php
/**
 * Stripe Webhook 受信 API
 * POST /api/webhook.php
 */

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/vendor/autoload.php';

\Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method not allowed');
}

$payload = file_get_contents('php://input');
$sigHeader = $_SERVER['HTTP_STRIPE_SIGNATURE'] ?? '';

try {
    $event = \Stripe\Webhook::constructEvent($payload, $sigHeader, STRIPE_WEBHOOK_SECRET);
} catch (\UnexpectedValueException $e) {
    error_log('Webhook: Invalid payload - ' . $e->getMessage());
    http_response_code(400);
    exit('Invalid payload');
} catch (\Stripe\Exception\SignatureVerificationException $e) {
    error_log('Webhook: Invalid signature - ' . $e->getMessage());
    http_response_code(400);
    exit('Invalid signature');
}

try {
    $db = getDB();

    switch ($event->type) {
        case 'checkout.session.completed':
            $session = $event->data->object;
            $sessionId = $session->id;

            $stmt = $db->prepare("UPDATE bookings SET stripe_payment_status = 'paid', status = 'confirmed' WHERE stripe_session_id = ? AND stripe_payment_status = 'unpaid'");
            $stmt->execute([$sessionId]);

            if ($stmt->rowCount() > 0) {
                $stmt = $db->prepare('SELECT id FROM bookings WHERE stripe_session_id = ?');
                $stmt->execute([$sessionId]);
                $booking = $stmt->fetch();

                if ($booking) {
                    $stmt = $db->prepare('INSERT INTO payments (booking_id, stripe_session_id, stripe_payment_intent_id, amount, currency, status, paid_at) VALUES (?, ?, ?, ?, ?, ?, NOW())');
                    $stmt->execute([$booking['id'], $sessionId, $session->payment_intent, $session->amount_total ?? 0, $session->currency ?? 'jpy', 'completed']);
                }
                error_log("Webhook: Booking confirmed - session {$sessionId}");
            }
            break;

        case 'checkout.session.expired':
            $session = $event->data->object;
            $sessionId = $session->id;
            $stmt = $db->prepare("UPDATE bookings SET stripe_payment_status = 'cancelled', status = 'cancelled' WHERE stripe_session_id = ? AND stripe_payment_status = 'unpaid'");
            $stmt->execute([$sessionId]);
            error_log("Webhook: Session expired - {$sessionId}");
            break;
    }

    http_response_code(200);
    echo json_encode(['status' => 'ok']);

} catch (Exception $e) {
    error_log('Webhook Processing Error: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Processing failed']);
}
