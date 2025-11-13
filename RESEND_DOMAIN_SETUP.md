# Resend Domain Setup Guide

## 🔴 Error: "The itBootCamp.com domain is not verified"

This error means you need to verify your domain in Resend before you can send emails from it.

---

## ✅ Solution: Add and Verify Your Domain

### Step 1: Go to Resend Dashboard

1. **Visit Resend Dashboard**

   - Go to: https://resend.com/domains
   - Or: https://resend.com → **Domains** (in the left sidebar)

2. **Login to your Resend account**
   - Make sure you're logged in with the same account that has your `RESEND_API_KEY`

---

### Step 2: Add Your Domain

1. **Click "Add Domain"** button (usually top right)

2. **Enter your domain**

   - Domain to add: `itBootCamp.com`
   - ⚠️ **Important:** Enter just the domain name, NOT the full email address
   - ✅ Correct: `itBootCamp.com`
   - ❌ Wrong: `noreply@itBootCamp.com`

3. **Click "Add Domain"**

---

### Step 3: Add DNS Records

After adding the domain, Resend will show you DNS records you need to add to your domain's DNS settings.

**You'll need to add these DNS records:**

1. **SPF Record** (TXT record)

   - Example: `v=spf1 include:resend.com ~all`

2. **DKIM Record** (TXT record)

   - Example: `resend._domainkey.itBootCamp.com` with a long key value

3. **DMARC Record** (TXT record) - Optional but recommended
   - Example: `v=DMARC1; p=none;`

**Where to add DNS records:**

- If your domain is hosted on:
  - **GoDaddy**: Go to DNS Management
  - **Namecheap**: Go to Advanced DNS
  - **Cloudflare**: Go to DNS → Records
  - **AWS Route 53**: Go to Hosted Zones
  - **Google Domains**: Go to DNS Settings
  - **Other providers**: Look for "DNS Settings" or "DNS Management"

**How to add:**

1. Copy each DNS record from Resend
2. Go to your domain registrar's DNS settings
3. Add each record as a TXT record
4. Save the changes

---

### Step 4: Wait for Verification

1. **DNS propagation** can take 5 minutes to 48 hours (usually 15-30 minutes)

2. **Check status in Resend**

   - Go back to https://resend.com/domains
   - You'll see the status: "Pending" → "Verified" ✅

3. **Once verified**, you can use emails like:
   - `noreply@itBootCamp.com`
   - `hello@itBootCamp.com`
   - `support@itBootCamp.com`
   - etc.

---

### Step 5: Update Your Environment Variable

Once your domain is verified, make sure your `EMAIL_FROM` environment variable is set correctly:

**In Vercel Dashboard:**

- Settings → Environment Variables
- Variable: `EMAIL_FROM`
- Value: `noreply@itBootCamp.com` (or any email using your verified domain)
- Save

**For Local Development (.env.local):**

```env
EMAIL_FROM=noreply@itBootCamp.com
```

---

## 🚀 Quick Alternative: Use Test Domain (No Setup Required)

If you want to test emails **right now** without domain verification:

1. **Remove or don't set** `EMAIL_FROM` environment variable
2. The code will automatically use `onboarding@resend.dev` (Resend's test domain)
3. This works immediately, no DNS setup needed!

**Note:** Test domain emails are fine for development/testing, but for production you should verify your own domain.

---

## 📋 Summary

**Domain to add:** `itBootCamp.com`

**Where to add it:** https://resend.com/domains

**What to do:**

1. Add domain in Resend
2. Copy DNS records from Resend
3. Add DNS records to your domain registrar
4. Wait for verification (15-30 minutes usually)
5. Update `EMAIL_FROM` environment variable

---

## ❓ Troubleshooting

**Q: Domain still shows "Pending" after adding DNS records?**

- Wait a bit longer (DNS can take up to 48 hours)
- Double-check DNS records are correct
- Make sure you added them to the correct domain

**Q: Can't find where to add DNS records?**

- Contact your domain registrar's support
- They can help you add TXT records

**Q: Want to test emails now?**

- Just remove `EMAIL_FROM` from environment variables
- The code will use `onboarding@resend.dev` automatically
