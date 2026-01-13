# Focus Up Website

Institutional website for **Focus Up**, designed to present the value proposition, services, and contact form in a clear and modern way.

**Live Site:** [https://focusupchecklist.org](https://focusupchecklist.org)

## Tech Stack

- HTML5, CSS3, JavaScript (Vanilla)
- PHP 8.3 (Serverless via Vercel)
- PHPMailer (SMTP email sending)
- Bootstrap 5 (Modals & Grid)

## Features

- Smooth scroll animations with reveal effects
- Interactive content slider with wheel navigation
- Contact form with client-side validation
- Server-side form processing with SMTP
- Honeypot bot protection
- Responsive design

## Project Structure

```
focusupchecklist.org/
├── index.html              # Main landing page
├── styles.css              # Global styles
├── js/
│   └── main.js            # Interactions (scroll, form, animations)
├── api/
│   ├── contact.php        # Contact form endpoint (PHP serverless)
│   └── phpmailer/         # PHPMailer SMTP library
│       └── src/
├── vercel.json            # Vercel PHP runtime config
├── img/                   # Images and assets
├── .gitignore
└── README.md
```

## Deployment (Vercel)

This site is deployed on **Vercel** with PHP serverless runtime.

### vercel.json Configuration:

```json
{
  "functions": {
    "api/contact.php": {
      "runtime": "vercel-php@0.7.4"
    }
  }
}
```

### Environment Variables (Required):

Set these in **Vercel Project Settings → Environment Variables**:

```
SMTP_HOST=your-smtp-host (e.g., smtp.gmail.com)
SMTP_USERNAME=your-email@example.com
SMTP_PASSWORD=your-app-password
SMTP_PORT=587
```

**For Gmail SMTP:**

1. Enable 2-Step Verification: https://myaccount.google.com/security
2. Create App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password as `SMTP_PASSWORD`

### Deploy to Vercel:

1. **Connect GitHub Repository**

   ```bash
   git push origin main
   ```

2. **Import to Vercel**

   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects `vercel.json`

3. **Add Environment Variables**

   - Settings → Environment Variables
   - Add SMTP credentials (see above)

4. **Deploy**
   - Automatic deployment on every push to `main`

### Custom Domain Setup:

**DNS Records at your domain provider:**

For root domain (`yourdomain.org`):

- Type: A | Name: @ | Value: `[See Vercel Dashboard for current IP]`

For www subdomain:

- Type: CNAME | Name: www | Value: `[See Vercel Dashboard for CNAME target]`

_Note: Always use the DNS values shown in your Vercel Dashboard (Settings → Domains) as they may vary._

## Local Development

### Run PHP Development Server:

```bash
php -S localhost:8000
```

### Local Environment Setup:

Create `.env` file in root (for local testing only):

```
SMTP_HOST=smtp.gmail.com
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_PORT=587
```

**Important:** Add `.env` to `.gitignore` (already included)

### Testing Contact Form:

- Navigate to: `http://localhost:8000`
- Fill out contact form
- Check configured email inbox

## Contact Form Configuration

The contact form sends emails via SMTP using PHPMailer.

**Security Features:**

- Input sanitization & validation
- Honeypot bot protection (hidden field)
- Rate limiting (5 submissions per hour per session)
- CORS restriction (specific origins only)
- Environment-based credentials (no hardcoded passwords)
- Generic error messages to clients (detailed logs server-side)

**Email Setup:**

- Recipient email configured in `api/contact.php` (line 103)
- To change recipient: Edit `$to` variable or add `RECIPIENT_EMAIL` environment variable
- SMTP credentials loaded from environment variables
- Supports both JSON and form-data requests

**Rate Limiting:**

- Form submissions are limited to 5 per hour per session
- Prevents spam and abuse
- Rate limit can be adjusted in `api/contact.php` (line 42-43)

### PHPMailer:

PHPMailer is included in `api/phpmailer/src/`.

For manual installation:

1. Download: https://github.com/PHPMailer/PHPMailer
2. Extract `src/` folder to `api/phpmailer/src/`

## Troubleshooting

### Contact Form Not Working?

1. Check environment variables are set in Vercel Dashboard
2. Verify SMTP credentials are correct (test with email client)
3. Check **Vercel → Project → Logs** for PHP errors
4. Ensure 2FA is enabled if using Gmail

### DNS Not Propagating?

1. Wait 1-2 hours (up to 48h for full propagation)
2. Verify DNS records match Vercel Dashboard instructions
3. Use https://www.whatsmydns.net to check global propagation
4. Clear browser cache / try incognito mode

### Build Errors?

1. Check `vercel.json` syntax is valid
2. Ensure `api/contact.php` and `api/phpmailer/` exist
3. Review build logs in Vercel Dashboard

## Contributing

This is a client project. For changes or issues, contact the development team.

## Credits

- **Client:** Focus Up
- **Agency:** CatCow.tv
- **Original Design:** Agustina Roig
- **Platform:** Vercel

## License

© 2025 Focus Up. All rights reserved.
