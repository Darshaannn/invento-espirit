# Invento Espirit — CLAUDE.md

This file gives AI assistants full context about the project so they can help immediately without re-reading the entire codebase.

---

## What Is This App?

**Invento Espirit** is a clinical cognitive assessment web app designed to help detect early signs of dementia/cognitive decline. Users take a structured screening test, and the app uses AI (Google Gemini) to analyze their responses and show results in a clinical-style dashboard.

**Live URL:** `https://invento-espirit-wp8m.vercel.app`
**GitHub:** `https://github.com/Darshaannn/invento-espirit`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.5.13 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + Framer Motion |
| Auth | Auth.js v5 (next-auth@5.0.0-beta.25) |
| Database | MongoDB Atlas via Mongoose |
| AI | Google Gemini (`@google/generative-ai`) |
| Icons | Lucide React |
| Animations | Framer Motion, Lenis (smooth scroll) |
| PDF Export | jsPDF + html2canvas |
| Charts | Chart.js + react-chartjs-2 |
| Deployment | Vercel |

---

## Project Structure

```
c:/Darshan/Innvento/          ← REPOSITORY ROOT
├── app/                      ← Next.js App Router pages & API routes
│   ├── page.tsx              ← Landing page (public homepage)
│   ├── layout.tsx            ← Root layout (SessionProvider wrapper)
│   ├── globals.css           ← Global Tailwind styles
│   ├── login/page.tsx        ← Login + Signup page (Auth.js, toggle modes)
│   ├── instructions/page.tsx ← Pre-test instructions page
│   ├── screening/page.tsx    ← The actual cognitive test (30 questions)
│   ├── assessment/page.tsx   ← Assessment loading/transition page
│   ├── (dashboard)/          ← Protected dashboard layout group
│   │   └── dashboard/
│   │       ├── page.tsx      ← Main dashboard (scores, chart, domain breakdown)
│   │       ├── history/page.tsx ← Test history list
│   │       └── games/page.tsx   ← Brain games (Word Recall, Number Span, etc.)
│   └── api/                  ← All API routes
│       ├── auth/[...nextauth]/route.ts   ← Auth.js handler
│       ├── assessments/route.ts          ← GET all assessments (history)
│       ├── assessments/latest/route.ts   ← GET most recent assessment
│       ├── assessments/submit/route.ts   ← POST new assessment result
│       ├── analytics/trends/route.ts     ← GET trend data for sparklines
│       ├── analytics/insights/route.ts   ← GET aggregate analytics
│       ├── questions/route.ts            ← GET the question bank
│       └── seed-questions/route.ts       ← Seed questions into DB (dev only)
│
├── components/               ← Shared React components
│   ├── Sidebar.tsx           ← Dashboard sidebar
│   ├── DashboardLayout.tsx   ← Wraps dashboard pages with sidebar
│   ├── EmptyStateDashboard.tsx ← Shown when user has no test history
│   └── ui/                   ← Specific UI components
│       ├── mesh-background.tsx ← Smooth shader background
│       └── hero-section-with-smooth-bg-shader.tsx ← Reference hero component
│
├── lib/                      ← Core utilities and shared logic
│   ├── auth.ts               ← Auth.js config
│   ├── dbConnect.ts          ← Mongoose connection singleton
│   ├── models/               ← Mongoose schemas
│   ├── services/             ← External services (AI/Gemini)
│   └── utils/                ← Helper functions
│
├── data/                     ← Question bank (JSON)
├── hooks/                    ← Custom React hooks
├── public/                   ← Static assets
├── .env.local                ← Local secrets
├── next.config.ts            ← Next.js config
├── CLAUDE.md                 ← This file
└── package.json
```

---

## Authentication Flow

- Using **Auth.js v5** with a **Credentials Provider**
- Users can **Sign Up** or **Sign In** on the same `/login` page (toggled with `authMode` state)
- On first login, if the email doesn't exist, the user is auto-created in MongoDB
- Session is provided globally via `SessionProvider` in `app/layout.tsx`
- Protected routes are inside `app/(dashboard)/`

### Environment Variables Required

```env
MONGODB_URI=mongodb+srv://...     # MongoDB Atlas connection string
AUTH_SECRET=...                    # Random secret for Auth.js JWT signing
```

---

## Assessment / Test Flow

```
/instructions → /screening → /dashboard (Comprehensive Analysis)
```

1. **Instructions** — Explains the test format
2. **Screening** (`/screening/page.tsx`) — 30 questions across 4 domains:
   - **Memory** — Word recall, object recognition
   - **Attention** — Digit span, sustained focus
   - **Executive Function** — Pattern matching, logic
    - **Orientation** — Date, place, time awareness
3. **Synthesis & Analysis** — Sends answers to `/api/assessments/submit` → Gemini AI analyzes responses.
4. **Dashboard** — The primary high-fidelity report and longitudinal tracker.

---

## Dashboard

The dashboard at `/dashboard` shows:
- **Overall accuracy score** (animated circular gauge)
- **Stability trend sparkline** (last 6 sessions)
- **Domain breakdown** (4 circular progress rings: Memory, Attention, Executive, Orientation)
- **AI-generated insights** and protocol recommendations

**Sidebar navigation:**
- Overview (`/dashboard`)
- History (`/dashboard/history`)
- Brain Games (`/dashboard/games`) — placeholder, coming soon

---

## Key Design Decisions

- **Design Style:** Premium clinical HUD aesthetic — dark/light mix, bold typography, animated gauges
- **Colors:** `#8B0000` (deep red), `#1A1A1A` (near-black), `#F8F9FA` (off-white)
- **Fonts:** System sans-serif (font-sans)
- **All API routes** use `export const dynamic = 'force-dynamic'` to prevent Vercel build-time static rendering errors (MongoDB isn't available at build time)
- **Test history** is stored in MongoDB if user is logged in; local localStorage only if guest
- **PDF export** uses `html2canvas` to screenshot the dashboard and `jsPDF` to package it

---

## Common Commands

```bash
# Dev server (run from c:/Darshan/Innvento)
npm run dev

# Build
npm run build

# Push to GitHub (triggers Vercel auto-deploy)
git add . && git commit -m "..." && git push origin main
```

---

## Files to NEVER Modify Carelessly

| File | Why |
|---|---|
| `lib/auth.ts` | Auth config — breaks login if changed incorrectly |
| `lib/dbConnect.ts` | MongoDB connection cache — must use singleton pattern |
| `next.config.ts` | Has build error bypass — don't remove ESLint/TS ignore flags yet |
| `.env.local` | Contains real secrets — never commit |
| `app/api/auth/[...nextauth]/route.ts` | Auth.js handler — don't rename or restructure |
