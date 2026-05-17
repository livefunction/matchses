<?php
/**
 * Stripe Checkout Session 作成 API
 * 
 * POST /api/checkout.php
 */

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['error' => 'Method not allowed'], 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!$input) {
    jsonResponse(['error' => 'Invalid JSON body'], 400);
}

$required = ['experience_id', 'guest_name', 'guest_email', 'guest_count', 'booking_date'];
foreach ($required as $field) {
    if (empty($input[$field])) {
        jsonResponse(['error' => "Missing required field: {$field}"], 400);
    }
}

$experienceId = (int) $input['experience_id'];
$guestName    = trim($input['guest_name']);
$guestEmail   = trim($input['guest_email']);
$guestCount   = max(1, min(10, (int) $input['guest_count']));
$bookingDate  = $input['booking_date'];
$guestWhatsapp = trim($input['guest_whatsapp'] ?? '');

if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $bookingDate)) {
    jsonResponse(['error' => 'Invalid date format. Use YYYY-MM-DD.'], 400);
}

if (!filter_var($guestEmail, FILTER_VALIDATE_EMAIL)) {
    jsonResponse(['error' => 'Invalid email address'], 400);
}

try {
    $db = getDB();

    $stmt = $db->prepare('SELECT id, title_en, slug, price_per_person, max_guests, is_active FROM experiences WHERE id = ?');
    $stmt->execute([$experienceId]);
    $experience = $stmt->fetch();

    if (!$experience) {
        jsonResponse(['error' => 'Experience not found'], 404);
    }
    if (!$experience['is_active']) {
        jsonResponse(['error' => 'This experience is no longer available'], 400);
    }
    if ($guestCount > $experience['max_guests']) {
        jsonResponse(['error' => "Maximum {$experience['max_guests']} guests allowed"], 400);
    }

    $pricePerPerson = (int) $experience['price_per_person'];
    $totalAmount = $pricePerPerson * $guestCount;

    require_once __DIR__ . '/vendor/autoload.php';
    \Stripe\Stripe::setApiKey(STRIPE_SECRET_KEY);

    $session = \Stripe\Checkout\Session::create([
        'payment_method_types' => ['card'],
        'line_items' => [[
            'price_data' => [
                'currency' => CURRENCY,
                'product_data' => [
                    'name' => $experience['title_en'],
                    'description' => "Booking for {$guestCount} guest(s) on {$bookingDate}",
                ],
                'unit_amount' => $pricePerPerson,
            ],
            'quantity' => $guestCount,
        ]],
        'mode' => 'payment',
        'success_url' => SITE_URL . '/booking/confirm?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => SITE_URL . '/experiences/' . $experience['slug'],
        'customer_email' => $guestEmail,
        'metadata' => [
            'experience_id' => $experienceId,
            'guest_name' => $guestName,
            'booking_date' => $bookingDate,
            'guest_count' => $guestCount,
        ],
    ]);

    $stmt = $db->prepare('
        INSERT INTO bookings (experience_id, guest_name, guest_email, guest_whatsapp, booking_date, guest_count, total_amount, stripe_session_id, stripe_payment_status, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, \'unpaid\', \'pending\')
    ');
    $stmt->execute([$experienceId, $guestName, $guestEmail, $guestWhatsapp, $bookingDate, $guestCount, $totalAmount, $session->id]);

    jsonResponse(['url' => $session->url, 'session_id' => $session->id]);

} catch (\Stripe\Exception\ApiErrorException $e) {
    error_log('Stripe API Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Payment service temporarily unavailable.'], 503);
} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    jsonResponse(['error' => 'Database error occurred'], 500);
} catch (Exception $e) {
    error_log('Checkout Error: ' . $e->getMessage());
    jsonResponse(['error' => 'An unexpected error occurred'], 500);
}
