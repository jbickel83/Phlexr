# PHLEXR Landing Page

Minimal Next.js App Router + Tailwind CSS landing page for PHLEXR.

Brand direction:

- PHLEXR
- "Post it. Prove it. Get rated."
- Premium black-and-gold visual style
- Large hero, feature cards, and early access username reserve section

## Stack

- Next.js
- React
- Tailwind CSS
- Vercel-ready structure

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
```

## Supabase setup

1. Copy `.env.example` to `.env.local`.
2. Paste your Supabase values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Supabase foundation files:

- `lib/supabase.js`
- `lib/supabase-auth.js`

## Deploy on Vercel

1. Push the repository to GitHub.
2. Open [Vercel](https://vercel.com/new).
3. Import the GitHub repository.
4. Keep the detected framework as `Next.js`.
5. Click `Deploy`.

If you want live Supabase auth later, add the same env vars in Vercel Project Settings.
