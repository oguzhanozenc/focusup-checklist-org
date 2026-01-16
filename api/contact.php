<?php
session_start(); // ADD THIS AT TOP

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

// CORS headers - restrict to specific origins
$allowedOrigins = [
    'https://focusupchecklist.org',
    'https://www.focusupchecklist.org',
    'https://focusupchecklist.vercel.app'
];
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    header('Access-Control-Allow-Origin: https://focusupchecklist.org');
}
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// OPTIONS request (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    exit();
}

// Rate limiting - 5 submissions per hour
$now = time();
$rateLimit = 5;
$ratePeriod = 3600;

if (!isset($_SESSION['form_submissions'])) {
    $_SESSION['form_submissions'] = [];
}

$_SESSION['form_submissions'] = array_filter(
    $_SESSION['form_submissions'], 
    function($timestamp) use ($now, $ratePeriod) {
        return ($now - $timestamp) < $ratePeriod;
    }
);

if (count($_SESSION['form_submissions']) >= $rateLimit) {
    http_response_code(429);
    echo json_encode([
        'success' => false, 
        'message' => 'Too many requests. Please try again in an hour.'
    ]);
    exit();
}

$_SESSION['form_submissions'][] = $now;

// JSON or form-data support
$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
if (strpos($contentType, 'application/json') !== false) {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    $fullName = trim($data['fullName'] ?? '');
    $email    = trim($data['email'] ?? '');
    $org      = trim($data['organization'] ?? '');
    $message  = trim($data['message'] ?? '');
    $honeypot = $data['website'] ?? '';
} else {
    $fullName = trim($_POST['fullName'] ?? '');
    $email    = trim($_POST['email'] ?? '');
    $org      = trim($_POST['organization'] ?? '');
    $message  = trim($_POST['message'] ?? '');
    $honeypot = $_POST['website'] ?? '';
}

// Basic validation
if (strlen($fullName) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

// Honeypot check (bot protection)
if (!empty($honeypot)) {
    error_log('Honeypot triggered - IP: ' . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'));
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid input']);
    exit();
}

// Prevent malicious email headers
$fullName = str_replace(array("\r", "\n"), ' ', $fullName);
$email    = filter_var($email, FILTER_SANITIZE_EMAIL);
$org      = htmlspecialchars($org, ENT_QUOTES, 'UTF-8');
$message  = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Destination email address
$to = 'focusupchecklist@gmail.com';
$subject = 'New contact form message - Focus Up';

// Email body
$body  = "Name: $fullName\n";
$body .= "Email: $email\n";
$body .= "Organization: $org\n\n";
$body .= "Message:\n$message\n";

// Send via SMTP
$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host = getenv('SMTP_HOST') ?: 'smtp.gmail.com';
    $mail->SMTPAuth = true;
    $mail->Username = getenv('SMTP_USERNAME');
    $mail->Password = getenv('SMTP_PASSWORD');
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = getenv('SMTP_PORT') ?: 587;

    $mail->setFrom($to, 'Focus Up Website');
    $mail->addAddress($to);
    $mail->addReplyTo($email, $fullName);
    $mail->Subject = $subject;
    $mail->Body = $body;

    $mail->send();
    echo json_encode(['success' => true, 'message' => 'Email sent successfully']);
} catch (Exception $e) {
    http_response_code(500);
    error_log('SMTP Error: ' . $mail->ErrorInfo);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to send email. Please try again later.'
    ]);
}