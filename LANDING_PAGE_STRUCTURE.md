# Landing Page Folder Structure

## 📁 Recommended Folder Structure

```
IT-Bootcamp-project/
├── app/
│   ├── layout.jsx              ← ROOT LAYOUT (wraps all pages)
│   ├── page.jsx                ← HOME PAGE (landing page)
│   ├── globals.css             ← Global styles
│   │
│   ├── components/             ← LANDING PAGE COMPONENTS FOLDER
│   │   ├── Header.jsx          ← Navigation/Header component
│   │   ├── Hero.jsx            ← Hero section component
│   │   ├── Features.jsx        ← Features section component
│   │   ├── Courses.jsx         ← Courses section component
│   │   ├── Testimonials.jsx    ← Testimonials section component
│   │   ├── CTA.jsx             ← Call-to-action section component
│   │   ├── Footer.jsx          ← Footer component
│   │   └── Sections.jsx        ← Dynamic sections component
│   │
│   ├── admin/
│   │   └── page.jsx
│   │
│   └── api/
│       └── ...
│
├── lib/
│   └── constants.js            ← Constants (defaultContent, etc.)
│
└── ...
```

---

## 📍 File Locations & Usage

### 1. **Layout File** (`app/layout.jsx`)

**Location:** `app/layout.jsx` (already exists)

**Purpose:**

- Wraps ALL pages in your application
- Contains `<html>`, `<body>`, and global providers
- Imports global CSS
- Sets metadata (SEO)

**What goes here:**

```jsx
// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children} {/* This renders page.jsx or any route */}
      </body>
    </html>
  );
}
```

**Note:** This file is used automatically by Next.js - you don't import it in pages.

---

### 2. **Home Page** (`app/page.jsx`)

**Location:** `app/page.jsx` (already exists)

**Purpose:**

- The main landing page (homepage)
- Renders at route: `/`
- Imports and uses all landing page components

**Structure:**

```jsx
// app/page.jsx
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Courses from "@/app/components/Courses";
import Testimonials from "@/app/components/Testimonials";
import Footer from "@/app/components/Footer";
import Sections from "@/app/components/Sections";

export default async function Home() {
  // Fetch content from KV
  const finalContent = content || defaultContent;

  return (
    <main>
      <Header hero={finalContent.hero} />
      <Hero hero={finalContent.hero} />
      <Features />
      <Courses />
      <Testimonials />
      <Sections sections={finalContent.sections} />
      <Footer />
    </main>
  );
}
```

---

### 3. **Components Folder** (`app/components/`)

**Location:** `app/components/` (create this folder)

**Purpose:**

- Contains reusable UI components for the landing page
- Each component is a separate file
- Components are imported and used in `page.jsx`

**Component Examples:**

#### `app/components/Header.jsx`

```jsx
// app/components/Header.jsx
export default function Header({ hero }) {
  return (
    <header className="w-full fixed top-0 left-0 bg-white/80 backdrop-blur border-b z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="font-bold text-sky-600">ITJobNow</div>
        <nav className="hidden md:flex gap-6 text-sm text-slate-700">
          <a href="#courses">Courses</a>
          <a href="#contact">Contact</a>
          <a href="/admin">Admin</a>
        </nav>
        <a
          href={hero.ctaLink}
          className="bg-sky-600 text-white px-4 py-2 rounded-md text-sm"
        >
          Enroll Now
        </a>
      </div>
    </header>
  );
}
```

#### `app/components/Hero.jsx`

```jsx
// app/components/Hero.jsx
import Image from "next/image";

export default function Hero({ hero }) {
  return (
    <section className="relative h-[520px] mt-[64px] flex items-center">
      {hero.backgroundImage ? (
        <Image
          src={hero.backgroundImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
      ) : (
        <div className="absolute inset-0 bg-slate-900" />
      )}
      <div className="absolute inset-0 bg-slate-900/60" />
      <div className="relative max-w-5xl mx-auto px-4 text-white">
        {hero.badge && (
          <p className="mb-3 text-sm text-orange-200">{hero.badge}</p>
        )}
        <h1 className="text-4xl md:text-5xl font-bold max-w-2xl mb-4">
          {hero.title}
        </h1>
        <p className="text-lg max-w-xl mb-6">{hero.subtitle}</p>
        <a
          href={hero.ctaLink}
          className="bg-sky-500 hover:bg-sky-400 px-6 py-3 rounded-md font-semibold"
        >
          {hero.ctaText}
        </a>
      </div>
    </section>
  );
}
```

#### `app/components/Sections.jsx`

```jsx
// app/components/Sections.jsx
export default function Sections({ sections }) {
  if (!sections || sections.length === 0) return null;

  return (
    <section className="max-w-6xl mx-auto px-4 py-12 space-y-6">
      {sections.map((section, idx) => (
        <div key={idx}>
          <h2 className="text-2xl font-semibold mb-2">{section.title}</h2>
          <ul className="list-disc list-inside text-slate-700">
            {section.items?.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
```

---

## 🔄 How It All Works Together

```
┌─────────────────────────────────────┐
│  app/layout.jsx                      │
│  - Wraps everything                  │
│  - Contains <html>, <body>            │
│  - Global styles & fonts              │
└──────────────┬───────────────────────┘
               │
               │ {children}
               │
┌──────────────▼───────────────────────┐
│  app/page.jsx                         │
│  - Home/Landing page                 │
│  - Fetches content from KV           │
│  - Imports & renders components      │
└──────────────┬───────────────────────┘
               │
               │ Imports
               │
┌──────────────▼───────────────────────┐
│  app/components/                      │
│  ├── Header.jsx                      │
│  ├── Hero.jsx                        │
│  ├── Features.jsx                    │
│  ├── Courses.jsx                    │
│  ├── Testimonials.jsx               │
│  ├── Footer.jsx                     │
│  └── Sections.jsx                   │
└───────────────────────────────────────┘
```

---

## 📝 Step-by-Step Implementation

### Step 1: Create Components Folder

```
mkdir app/components
```

### Step 2: Create Individual Component Files

- `app/components/Header.jsx`
- `app/components/Hero.jsx`
- `app/components/Features.jsx`
- `app/components/Courses.jsx`
- `app/components/Testimonials.jsx`
- `app/components/Footer.jsx`
- `app/components/Sections.jsx`

### Step 3: Build Each Component

- Extract the JSX from your current `page.jsx`
- Create separate component files
- Export each component as default

### Step 4: Update `app/page.jsx`

- Import all components
- Render them in order
- Pass props (like `hero`, `sections`) to components

### Step 5: Layout is Already Set

- `app/layout.jsx` already exists and wraps everything
- No changes needed unless you want to add global providers

---

## 🎯 Alternative Structure (if you prefer)

You can also organize components by feature:

```
app/
├── components/
│   ├── layout/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── sections/
│   │   ├── Hero.jsx
│   │   ├── Features.jsx
│   │   ├── Courses.jsx
│   │   └── Testimonials.jsx
│   └── ui/
│       └── Button.jsx
```

---

## ✅ Summary

| File/Folder    | Location                      | Purpose                          |
| -------------- | ----------------------------- | -------------------------------- |
| **Layout**     | `app/layout.jsx`              | Wraps all pages, global setup    |
| **Home Page**  | `app/page.jsx`                | Landing page, imports components |
| **Components** | `app/components/`             | Reusable UI components           |
| **Header**     | `app/components/Header.jsx`   | Navigation bar                   |
| **Hero**       | `app/components/Hero.jsx`     | Hero section                     |
| **Sections**   | `app/components/Sections.jsx` | Dynamic content sections         |
| **Footer**     | `app/components/Footer.jsx`   | Footer component                 |

---

## 🚀 Quick Start

1. **Create folder:** `app/components/`
2. **Create components:** Extract sections from `page.jsx` into separate files
3. **Update `page.jsx`:** Import and render components
4. **Layout:** Already set up, no changes needed

---

## 💡 Best Practices

1. **Component naming:** Use PascalCase (e.g., `Header.jsx`, `Hero.jsx`)
2. **Props:** Pass data as props from `page.jsx` to components
3. **Client components:** If component needs interactivity, add `"use client"` at top
4. **Server components:** Default - great for data fetching
5. **Reusability:** Make components reusable with props

---

**Your `app/page.jsx` will look like this:**

```jsx
// app/page.jsx
import Header from "@/app/components/Header";
import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import Courses from "@/app/components/Courses";
import Testimonials from "@/app/components/Testimonials";
import Footer from "@/app/components/Footer";
import Sections from "@/app/components/Sections";
import { defaultContent, KV_KEY } from "@/lib/constants";
import { kv } from "@vercel/kv";

export default async function Home() {
  // Fetch content
  let content = null;
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      content = await kv.get(KV_KEY);
    } catch (error) {
      console.error("KV error:", error);
    }
  }

  const finalContent = content || defaultContent;

  return (
    <main className="min-h-screen">
      <Header hero={finalContent.hero} />
      <Hero hero={finalContent.hero} />
      <Features />
      <Courses />
      <Testimonials />
      <Sections sections={finalContent.sections} />
      <Footer />
    </main>
  );
}
```
