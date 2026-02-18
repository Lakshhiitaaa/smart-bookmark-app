# Smart Bookmark App

A simple real-time bookmark manager built using Next.js, Supabase, and Tailwind CSS.

## 🚀 Features

* Google OAuth Authentication (No email/password)
* Add bookmarks (Title + URL)
* Private bookmarks per user (Row Level Security)
* Real-time updates across tabs
* Delete bookmarks
* Fully deployed on Vercel

## 🛠️ Tech Stack

* Next.js (App Router)
* Supabase (Auth + Database + Realtime)
* Tailwind CSS
* Vercel (Deployment)

---

## 🔐 Authentication

Users can sign in only using Google OAuth via Supabase Auth.

Sessions are handled securely and users are redirected to their private dashboard after login.

---

## 📂 Database Structure

Table: `bookmarks`

Columns:

* id (UUID, Primary Key)
* created_at (Timestamp)
* user_id (UUID, Foreign Key → Auth Users)
* title (Text)
* url (Text)

Row Level Security (RLS) ensures users can only access their own bookmarks.

---

## ⚡ Realtime Functionality

Supabase Realtime subscriptions are used to update bookmarks instantly across multiple tabs without page refresh.

---

## 🌍 Live Deployment

Vercel URL:
https://smart-bookmark-app-five-chi.vercel.app

---

## 🧩 Challenges Faced & Solutions

### 1. Google OAuth Redirect Loop

**Problem:** After login, users were redirected back to the login page.
**Solution:** Added `redirectTo` option in Supabase OAuth login function.

---

### 2. Invalid Supabase URL Error

**Problem:** Environment variables were misconfigured.
**Solution:** Corrected `.env.local` and Vercel environment variables formatting.

---

### 3. Localhost Redirect After Deployment

**Problem:** OAuth redirected to `localhost` in production.
**Solution:** Updated Supabase Site URL and Redirect URLs to Vercel domain.

---

### 4. Realtime Not Updating

**Problem:** Bookmarks didn’t sync across tabs.
**Solution:** Enabled Supabase Realtime and added subscription listeners.

---

## 🧪 How to Run Locally

```bash
git clone <repo-url>
cd smart-bookmark-app
npm install
npm run dev
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_KEY
```

---

## 📌 Submission Notes

* Tested with multiple Google accounts
* Verified private bookmark isolation
* Verified realtime sync
* Fully production deployed

---

## 👩‍💻 Author

Lakshita
