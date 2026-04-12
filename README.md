# InterviewAI

InterviewAI is an AI-powered mock interview platform built with Next.js App Router, Supabase, VAPI, and Groq.

## Features

- Public landing page (`/`)
- Combined sign-in/sign-up page (`/auth`) using Supabase Auth
- Protected dashboard (`/dashboard`) with:
	- Start Interview tab
	- History tab with structured Q&A summaries
	- Job marketplace tab with pre-selection flow
- API routes:
	- `POST /api/summarize`
	- `POST /api/interviews/complete`
	- `POST /api/vapi/webhook`
- Next.js 16 route protection with `proxy.ts`

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# VAPI
NEXT_PUBLIC_VAPI_PUBLIC_KEY=
NEXT_PUBLIC_VAPI_ASSISTANT_ID=
VAPI_WEBHOOK_SECRET=

# Groq
GROQ_API_KEY=
```

## Local Setup

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Database Setup (Supabase)

Apply the SQL migration in:

- `supabase/migrations/202604120001_init.sql`

This creates:

- `users`
- `jobs`
- `interviews`
- `interview_summaries`

It also enables RLS and includes starter job templates.

## Notes

- If `GROQ_API_KEY` is missing, the app uses a local fallback summarizer.
- If VAPI keys are missing, interviews can still be completed with manual transcript input.
