<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/phpmailer/src/Exception.php';
require __DIR__ . '/phpmailer/src/PHPMailer.php';
require __DIR__ . '/phpmailer/src/SMTP.php';

// Only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Receive and sanitize data
$fullName = trim($_POST['fullName'] ?? '');
$email    = trim($_POST['email'] ?? '');
$org      = trim($_POST['organization'] ?? '');
$message  = trim($_POST['message'] ?? '');

// Basic validation
if (strlen($fullName) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('Invalid input');
}

// Honeypot check (bot protection)
if (!empty($_POST['website'])) {
    http_response_code(400);
    exit('Invalid input');
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

// Send via SMTP - credentials from environment variables (secure)
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
    echo 'OK';
} catch (Exception $e) {
    http_response_code(500);
    echo 'Error sending email: ' . $mail->ErrorInfo;
}