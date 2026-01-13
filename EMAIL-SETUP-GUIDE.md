# Deployment Guide - Focus Up Website

**This site is deployed on Vercel with serverless PHP.**

## For Clients

This website is already live and configured. To update content or troubleshoot:

### Site URL

- Production: https://focusupchecklist.org
- Preview: https://focusupchecklist.vercel.app

### Contact Form Setup

The contact form sends emails via SMTP. Email credentials are managed by your developer through Vercel's dashboard.

**To change the recipient email:** Contact your developer to update `api/contact.php`

**If forms aren't working:** Check with your developer - SMTP credentials may need updating in Vercel.

### Making Content Changes

1. Edit files in GitHub repository
2. Commit and push changes
3. Vercel automatically deploys (2-3 minutes)

### Support

For technical issues, contact your development team.

---

## For Developers

See [README.md](README.md) for full deployment documentation including:

- Vercel setup
- Environment variables
- DNS configuration
- Local development
