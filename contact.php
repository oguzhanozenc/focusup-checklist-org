<?php
// Solo aceptar POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

// Recibir y sanear datos
$fullName = trim($_POST['fullName'] ?? '');
$email    = trim($_POST['email'] ?? '');
$org      = trim($_POST['organization'] ?? '');
$message  = trim($_POST['message'] ?? '');

// Validaciones básicas
if (strlen($fullName) < 2 || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit('Invalid input');
}

// Evitar encabezados maliciosos en el email
$fullName = str_replace(array("\r", "\n"), ' ', $fullName);
$email    = filter_var($email, FILTER_SANITIZE_EMAIL);
$org      = htmlspecialchars($org, ENT_QUOTES, 'UTF-8');
$message  = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Dirección de destino (email del cliente)
$to = 'focusupchecklist@gmail.com'; // <-- cámbialo por el real

$subject = 'New contact form message - Focus Up';

// Cuerpo del mail
$body  = "Name: $fullName\n";
$body .= "Email: $email\n";
$body .= "Organization: $org\n\n";
$body .= "Message:\n$message\n";

// Headers
$headers  = "From: Focus Up Website <no-reply@su-dominio.com>\r\n"; // remitente técnico
$headers .= "Reply-To: $fullName <$email>\r\n";

// Enviar
$sent = mail($to, $subject, $body, $headers);

// Si lo usas con fetch/AJAX, responde simple:
if ($sent) {
    echo 'OK';
} else {
    http_response_code(500);
    echo 'Error sending email';
}
