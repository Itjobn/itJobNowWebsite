# Vercel Blob Setup Guide

## 🔴 Error: "No token found"

This error means the `BLOB_READ_WRITE_TOKEN` environment variable is not configured.

---

## ✅ Solution: Get Your Blob Token

### Option 1: Vercel Dashboard (Recommended)

1. **Go to Vercel Dashboard**

   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Navigate to Settings**

   - Click on your project
   - Go to **Settings** → **Environment Variables**

3. **Add Blob Token**

   - Variable name: `BLOB_READ_WRITE_TOKEN`
   - Get the token from: **Settings** → **Storage** → **Blob** → **Create Token**
   - Or use existing token if you already have Blob storage

4. **Set for All Environments**
   - Select: Production, Preview, and Development
   - Click **Save**

### Option 2: Local Development (.env.local)

If you're running locally, create a `.env.local` file in your project root:

```env
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Get the token:**

1. Go to Vercel Dashboard
2. Settings → Storage → Blob
3. Create a new token or copy existing one
4. Paste it in `.env.local`

---

## 📋 Required Environment Variables

For full functionality, you need:

```env
# Vercel Blob (for images/videos)
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Vercel KV (for JSON data)
KV_REST_API_URL=https://your-kv-url.upstash.io
KV_REST_API_TOKEN=your-kv-token

# Admin Password
CONTENT_EDIT_PASSWORD=your-secure-password
```

---

## 🚀 Quick Setup Steps

### Step 1: Create Blob Storage in Vercel

1. Go to Vercel Dashboard → Your Project
2. Settings → Storage → **Create Database**
3. Select **Blob**
4. Follow the setup wizard
5. Copy the token

### Step 2: Add Environment Variable

**In Vercel Dashboard:**

- Settings → Environment Variables
- Add `BLOB_READ_WRITE_TOKEN`
- Paste your token
- Save

**For Local Development:**

- Create `.env.local` file
- Add: `BLOB_READ_WRITE_TOKEN=your-token-here`
- Restart dev server: `npm run dev`

---

## 🔍 Verify Setup

After adding the token:

1. **Restart your dev server** (if local)
2. **Try uploading a file** in admin panel
3. **Check console** for errors

---

## 💡 Troubleshooting

### Token not working?

- Make sure token starts with `vercel_blob_rw_`
- Check if token has correct permissions (read/write)
- Verify token is not expired

### Still getting errors?

- Check Vercel Dashboard → Storage → Blob is active
- Verify environment variable name is exactly: `BLOB_READ_WRITE_TOKEN`
- Restart your dev server after adding `.env.local`

### Local vs Production

- **Local:** Use `.env.local` file
- **Production:** Set in Vercel Dashboard → Environment Variables

---

## 📝 Notes

- Blob token is different from KV token
- Each storage type (KV, Blob) has its own token
- Tokens are project-specific
- Keep tokens secure - never commit to git

---

## 🎯 Summary

**What you need:**

- `BLOB_READ_WRITE_TOKEN` environment variable
- Get it from: Vercel Dashboard → Storage → Blob → Create Token

**Where to add it:**

- **Vercel:** Settings → Environment Variables
- **Local:** `.env.local` file

**After adding:**

- Restart dev server
- Try uploading again
