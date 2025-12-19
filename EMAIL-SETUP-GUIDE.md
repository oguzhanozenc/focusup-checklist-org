# Email Setup Guide for Focus Up Website

**This website is ready to send emails from the contact form.**  
You only need to connect it to your hosting and email address.

There are **two ways** your hosting can send emails:  
**Option A**: Basic PHP `mail()` (simpler)  
**Option B**: SMTP (more reliable if Option A fails)

**Start with Option A**. If emails don't arrive, use **Option B**.

---

## Files you need

- `index.html`: Contains the contact form  
- `contact.php`: **THIS IS THE ONLY FILE YOU EDIT**  
- CSS/JS already handle validation and "Thank you" message inside the modal

---

## What to ask your hosting provider

**For Option A**:  
- "Does PHP `mail()` work on my plan?"  
- Email address for the site (e.g. `info@yourdomain.com`)

**For Option B (if needed)**:  
- SMTP server (e.g. `smtp.yourdomain.com`)  
- SMTP port (587 or 465)  
- SMTP username (usually your full email)  
- SMTP password

---

## Option A: PHP mail() (Try this first)

### Step 1: Upload files
Upload **all project files** (including `contact.php`) to your hosting's main folder (`public_html` or similar).

### Step 2: Edit contact.php
1. Open `contact.php` in any text editor
2. Find this line (around line 25):
$to = 'focusupchecklist@gmail.com'; // <-- I ALREADY CHANGED THIS

text
3. Replace with **your email**:
$to = 'info@yourdomain.com';

text

4. Find these lines (around line 35):
$headers = "From: Focus Up Website no-reply@su-dominio.com\r\n";

text
5. Change to **your domain**:
$headers = "From: Focus Up Website no-reply@yourdomain.com\r\n";

text

### Step 3: Save & test
1. Save and upload `contact.php`
2. Open your website → Contact form → Fill required fields → **Send message**
3. Should see: **"Thank you! Your message has been sent."** inside modal
4. Check your email inbox (and spam folder)

**✅ If you receive the email: DONE!**  
**❌ If no email arrives: Go to Option B**

---

## Option B: SMTP (if mail() doesn't work)

### Step 1: Download PHPMailer
1. Go to: https://github.com/PHPMailer/PHPMailer
2. Click **"Code" → "Download ZIP"**
3. Extract ZIP → copy the `src` folder

### Step 2: Upload PHPMailer
Create folder `phpmailer` next to `contact.php`:
your-website/
├── contact.php
├── phpmailer/
│ └── src/
│ ├── PHPMailer.php
│ ├── SMTP.php
│ └── Exception.php
└── index.html

text

### Step 3: Edit contact.php for SMTP
1. **At the top** (after `<?php`), add:
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require DIR . '/phpmailer/src/Exception.php';
require DIR . '/phpmailer/src/PHPMailer.php';
require DIR . '/phpmailer/src/SMTP.php';

text

2. **Replace the `mail()` section** (around line 40) with:
$mail = new PHPMailer(true);
try {
$mail->isSMTP();
$mail->Host = 'smtp.yourdomain.com'; // FROM YOUR HOSTING
$mail->SMTPAuth = true;
$mail->Username = 'info@yourdomain.com'; // YOUR EMAIL
$mail->Password = 'your-email-password'; // YOUR PASSWORD
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
$mail->Port = 587; // 587 or 465

text
   $mail->setFrom('info@yourdomain.com', 'Focus Up');
   $mail->addAddress($to);
   $mail->Subject = $subject;
   $mail->Body    = $body;

   $mail->send();
   echo 'OK';
} catch (Exception $e) {
http_response_code(500);
echo 'Error sending email';
}

text

3. Fill in **YOUR hosting details** and save/upload.

### Step 4: Test again
Same test as Option A. Should now work reliably.

---

## Troubleshooting

**"Please complete required fields"** → Fill name + email  
**"Problem sending message"** → Check hosting PHP logs or contact support  
**No PHPMailer errors** → Check spam folder or email password

---

## Summary

1. **Upload everything** to hosting
2. **Edit 2 lines** in `contact.php` (email addresses)
3. **Test form** → receive email or go to SMTP
4. **SMTP only if needed** (5 min extra setup)

The form already validates fields (*) and shows success/error messages. You're all set!

**Need help?** Contact me: agustina.roig@gmail.com