# tunisia-marketplace

Production-ready single-vendor e-commerce app for Tunisia using Next.js App Router + Prisma + NextAuth.

## Why Vercel NOT_FOUND happened
If this project is deployed with the **repository root** set incorrectly (for example, before this fix when app files were nested in a subfolder), Vercel can build/deploy without finding the expected Next.js routes and return `NOT_FOUND`.

This repository now keeps the Next.js app at the root so Vercel auto-detects it correctly.

## Features
- FR/EN UX foundation and TND-only pricing
- Storefront: homepage sections, categories, search, product page, cart, checkout
- Customer account: profile, addresses, order history
- Payments adapter: COD (implemented), e-Dinar + Monétique (stubs with TODOs)
- Admin on hidden route `/admin` with dedicated env-based auth
- Admin CRUD: categories, products, inventory, orders, promo codes, delivery fees, featured sections

## Local setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy env:
   ```bash
   cp .env.example .env
   ```
3. Start PostgreSQL and update `DATABASE_URL`.
4. Prisma migrate + seed:
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```
5. Run app:
   ```bash
   npm run dev
   ```

## Google OAuth setup
- Create OAuth credentials in Google Console.
- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- Callback: `http://localhost:3000/api/auth/callback/google`

## Email setup
- Dev fallback uses SMTP (Mailhog/Mailpit suggested): set `SMTP_HOST`, `SMTP_PORT`
- Production can use Resend via `RESEND_API_KEY`

## Vercel deploy
1. Push repository to GitHub.
2. Import on Vercel.
3. Framework preset should auto-detect as **Next.js**.
4. Add all env vars from `.env.example`.
5. Provision PostgreSQL (Neon/Supabase/RDS) and set `DATABASE_URL`.
6. Run Prisma migration on deployment (`npx prisma migrate deploy`).

## Notes on Tunisian card gateways
- `lib/payments/providers.ts` includes clean adapter stubs for e-Dinar + Monétique.
- Plug official gateway specs in TODO sections without refactoring checkout.
