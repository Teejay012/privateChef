# AuraChefs — Full-Stack Private Dining Platform

Next.js 15 · MongoDB · NextAuth.js v5 · Tailwind CSS v3 · Framer Motion · TypeScript

---

## Quick Start

```bash
# 1. Install
npm install

# 2. Configure .env.local (already created)
#    Update MONGODB_URI with your connection string

# 3. Run
npm run dev

# 4. Seed demo chefs
# Visit: http://localhost:3000/api/seed
```

---

## .env.local

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/aurachefs
NEXTAUTH_SECRET=any-random-32-char-string
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
```

**Free MongoDB Atlas:** mongodb.com/atlas → free cluster → copy connection string

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing — hero, features, featured chefs |
| `/chefs` | Browse & filter all chefs |
| `/chefs/:id` | Chef profile with signature dishes & booking card |
| `/flavor-dna` | 3-question AI taste profile quiz |
| `/mood` | Mood-based chef discovery |
| `/sos` | Emergency same-day chef dispatch |
| `/passport` | Culinary passport badge collection |
| `/book/:chefId` | 3-step booking + mock payment |
| `/consultation/:bookingId` | Pre-dinner chat with chef |
| `/dashboard` | User bookings, flavor DNA, passport |
| `/chef-studio` | Chef profile editor (chefs only) |
| `/sign-in` | Login (email/password + Google) |
| `/register` | Register as diner OR chef |

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Register user/chef |
| GET | `/api/chefs` | List chefs (filter: mood, cuisine, sos) |
| GET/PATCH | `/api/chefs/:id` | Get/update chef |
| GET/PUT | `/api/chefs/by-user/:userId` | Chef profile by user ID |
| POST | `/api/chefs/:id/review` | Submit review |
| GET/POST | `/api/bookings` | List/create bookings |
| GET/PATCH | `/api/bookings/:id` | Get booking + send consult message |
| POST | `/api/payment` | Mock payment processing |
| GET/PATCH | `/api/user` | User profile + flavor DNA |
| GET | `/api/seed` | Seed 6 demo chef profiles |

---

## User Roles

**Diner** — browse chefs, take flavor DNA quiz, book, chat, collect passport badges  
**Chef** — everything above + Chef Studio to manage profile, dishes, availability, earnings

Register selects the role. After registering as a chef, visit `/chef-studio` to set up your profile.

---

## Deploy to Vercel

```bash
npm i -g vercel && vercel
```

Set env vars in Vercel dashboard. Done.
