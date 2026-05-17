<?php
/**
 * 予約データ取得 API
 * GET /api/booking.php?session_id=cs_xxx
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$sessionId = $_GET['session_id'] ?? '';
if (empty($sessionId) || !preg_match('/^cs_[a-zA-Z0-9]+$/', $sessionId)) {
    jsonResponse(['error' => 'Invalid session_id'], 400);
}

try {
    $db = getDB();

    $stmt = $db->prepare('
        SELECT b.id, b.guest_name, b.guest_email, b.booking_date, b.guest_count, b.total_amount, b.status, b.stripe_payment_status,
               e.title_en, e.slug, e.duration, e.location
        FROM bookings b
        JOIN experiences e ON b.experience_id = e.id
        WHERE b.stripe_session_id = ?
    ');
    $stmt->execute([$sessionId]);
    $booking = $stmt->fetch();

    if (!$booking) {
        jsonResponse(['error' => 'Booking not found'], 404);
    }

    jsonResponse(['booking' => [
        'id' => $booking['id'],
        'guest_name' => $booking['guest_name'],
        'guest_email' => $booking['guest_email'],
        'booking_date' => $booking['booking_date'],
        'guest_count' => $booking['guest_count'],
        'total_amount' => $booking['total_amount'],
        'status' => $booking['status'],
        'payment_status' => $booking['stripe_payment_status'],
        'experience' => [
            'title' => $booking['title_en'],
            'slug' => $booking['slug'],
            'duration' => $booking['duration'],
            'location' => $booking['location'],
        ],
    ]]);

} catch (Exception $e) {
    error_log('Booking API Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Server error'], 500);
}
