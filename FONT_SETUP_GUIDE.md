# Local Font Setup Guide - Switzer Font

## 📁 Best Practice Folder Structure

```
IT-Bootcamp-project/
├── fonts/                    ← CREATE THIS FOLDER (at root level)
│   ├── Switzer-Regular.woff2
│   ├── Switzer-Medium.woff2
│   ├── Switzer-SemiBold.woff2
│   ├── Switzer-Bold.woff2
│   └── (optional: Switzer-RegularItalic.woff2, etc.)
│
├── lib/
│   └── fonts.js              ← Font configuration file (already created)
│
├── app/
│   ├── layout.jsx            ← Import and use fonts here
│   └── globals.css            ← Set default font family
│
└── ...
```

---

## ✅ Step-by-Step Setup

### Step 1: Create Fonts Folder

Create a `fonts` folder at the **root level** of your project (same level as `app/`, `lib/`, etc.)

```
mkdir fonts
```

### Step 2: Add Font Files

Place your Switzer font files in the `fonts/` folder:

- `Switzer-Regular.woff2` (400 weight)
- `Switzer-Medium.woff2` (500 weight)
- `Switzer-SemiBold.woff2` (600 weight)
- `Switzer-Bold.woff2` (700 weight)

**Recommended format:** `.woff2` (best compression, modern browser support)

### Step 3: Font Configuration (Already Done ✅)

The `lib/fonts.js` file has been created with Switzer configuration.

### Step 4: Update Layout (Already Done ✅)

The `app/layout.jsx` has been updated to import and use Switzer.

### Step 5: Update CSS (Already Done ✅)

The `app/globals.css` has been updated to set Switzer as default.

---

## 🎯 How to Use Switzer Font

### Option 1: Use as Default (Already Set)

The font is already set as default in `globals.css`, so all text will use Switzer automatically.

### Option 2: Use CSS Variable

```jsx
<div className="font-switzer">This text uses Switzer font</div>
```

### Option 3: Use Tailwind Config (Optional)

You can add Switzer to your Tailwind config for easier access:

```js
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        switzer: ["var(--font-switzer)", "sans-serif"],
      },
    },
  },
};
```

Then use: `className="font-switzer"`

---

## 📝 Font File Naming

Make sure your font files follow this naming convention:

- `Switzer-Regular.woff2` → Weight: 400
- `Switzer-Medium.woff2` → Weight: 500
- `Switzer-SemiBold.woff2` → Weight: 600
- `Switzer-Bold.woff2` → Weight: 700

If your files have different names, update the paths in `lib/fonts.js`.

---

## 🔧 Font Configuration Options

In `lib/fonts.js`, you can customize:

```javascript
export const switzer = localFont({
  src: [...],              // Font file paths
  variable: "--font-switzer",  // CSS variable name
  display: "swap",         // Font display strategy
  preload: true,           // Preload font (default: true)
  fallback: ["Arial", "sans-serif"],  // Fallback fonts
});
```

**Display options:**

- `swap` - Shows fallback immediately, swaps when font loads (best for performance)
- `optional` - Only uses font if available quickly
- `block` - Blocks text until font loads (not recommended)

---

## 🎨 Using Different Font Weights

Once fonts are loaded, you can use different weights:

```jsx
// Regular (400)
<div className="font-normal">Regular text</div>

// Medium (500)
<div className="font-medium">Medium text</div>

// SemiBold (600)
<div className="font-semibold">SemiBold text</div>

// Bold (700)
<div className="font-bold">Bold text</div>
```

---

## 📦 Font File Formats

**Recommended order (best to worst):**

1. `.woff2` - Best compression, modern browsers ✅ (Recommended)
2. `.woff` - Good compression, older browser support
3. `.ttf` - Large file size, universal support
4. `.otf` - Large file size, universal support

**Best Practice:** Use `.woff2` for modern browsers, and optionally add `.woff` as fallback.

---

## ✅ Current Setup Summary

1. ✅ **Font configuration:** `lib/fonts.js` created
2. ✅ **Layout updated:** `app/layout.jsx` imports Switzer
3. ✅ **CSS updated:** `app/globals.css` sets Switzer as default
4. ⏳ **Font files needed:** Add font files to `fonts/` folder

---

## 🚀 Next Steps

1. **Create `fonts/` folder** at root level
2. **Add Switzer font files** (.woff2 format recommended)
3. **Verify file paths** in `lib/fonts.js` match your actual file names
4. **Test the font** by viewing your app - text should render in Switzer

---

## 💡 Tips

- **Font loading:** Next.js automatically optimizes font loading
- **Performance:** Using `.woff2` gives best performance
- **Fallback:** Switzer will fallback to system fonts if not loaded
- **Variable fonts:** If you have a variable font file, you can use a single file instead of multiple weights

---

## 🔍 Troubleshooting

**Font not showing?**

- Check file paths in `lib/fonts.js` match actual file locations
- Ensure files are in `fonts/` folder at root level
- Check browser console for font loading errors
- Verify font file format is correct

**Font paths:**

- Path is relative to `lib/fonts.js` file
- `../fonts/` means go up one level from `lib/` to root, then into `fonts/`

---

## 📚 Additional Resources

- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [Local Font Documentation](https://nextjs.org/docs/app/api-reference/components/font#local-font)
