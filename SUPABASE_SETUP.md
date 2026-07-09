# Red Dot Metals — Supabase Setup Guide

Complete step-by-step instructions to connect this project to Supabase.

---

## Step 1 — Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com) and sign in (or create an account).
2. Click **New Project**.
3. Choose your organisation.
4. Fill in:
   - **Name:** `red-dot-metals` (or any name you prefer)
   - **Database Password:** Set a strong password and save it.
   - **Region:** Southeast Asia (Singapore) — `ap-southeast-1`
5. Click **Create new project** and wait ~2 minutes.

---

## Step 2 — Get Your API Keys

1. In your Supabase project, go to **Project Settings → API**.
2. Copy these three values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ Keep secret — never expose to frontend

---

## Step 3 — Run the SQL Schema

1. In your Supabase project, go to **SQL Editor**.
2. Click **New Query**.
3. Open the file `supabase/schema.sql` from this project.
4. Paste the entire contents into the SQL Editor.
5. Click **Run**.

This creates:
- `quote_requests` table
- `contact_requests` table
- `admin_quote_management` table
- All Row Level Security (RLS) policies
- Indexes and triggers

---

## Step 4 — Create the Admin User (HANU)

1. In your Supabase project, go to **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Fill in:
   - **Email:** `hanushree20@gmail.com`
   - **Password:** Choose a strong password (min 8 characters)
   - **Auto Confirm User:** ✅ Enable
4. Click **Create user**.

> To add more admins later, repeat Step 4 with the new email/password.
> No code changes are required.

**Important — Disable public sign-up:**
1. Go to **Authentication → Providers → Email**.
2. Turn off **"Enable Email Signups"**.
3. Save.

This ensures no one can self-register — only manually created users can log in.

---

## Step 5 — Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   RESEND_API_KEY=re_your_api_key
   FROM_EMAIL=noreply@yourdomain.com
   ADMIN_EMAIL=hanushree20@gmail.com
   ```

---

## Step 6 — Set Up Resend (Email)

1. Go to [https://resend.com](https://resend.com) and create an account.
2. Go to **API Keys → Create API Key**.
3. Copy the key into `RESEND_API_KEY` in `.env.local`.
4. Go to **Domains → Add Domain** and verify your domain.
5. Set `FROM_EMAIL` to an address on that verified domain (e.g. `noreply@yourdomain.com`).

> Until you have a verified domain, you can send to your own email only (Resend sandbox mode).

---

## Step 7 — Run the Project

```bash
npm install
npm run dev
```

Visit:
- Public website: `http://localhost:3000`
- Admin login: `http://localhost:3000/en/admin`
- Admin dashboard: `http://localhost:3000/en/admin/dashboard`

---

## Step 8 — Deploy to Vercel (Recommended)

1. Push your project to GitHub.
2. Go to [https://vercel.com](https://vercel.com) → **New Project** → Import your repo.
3. In **Environment Variables**, add all keys from `.env.local`.
4. Deploy.

---

## Security Notes

- `SUPABASE_SERVICE_ROLE_KEY` is only used in API routes (server-side). It is never sent to the browser.
- The `admin_quote_management` table has RLS: only authenticated Supabase users can access it.
- The public `quote_requests` and `contact_requests` tables allow anonymous INSERT but never SELECT — customers cannot read back any data.
- Admin routes are protected by HttpOnly cookie + server-side token validation.
- The middleware also redirects `/admin/dashboard` to `/admin` if no token cookie exists.

---

## Adding More Admins Later

1. Go to Supabase Dashboard → **Authentication → Users**.
2. Click **Add user → Create new user**.
3. Enter the new admin's email and password.
4. That's it — no code changes needed.
