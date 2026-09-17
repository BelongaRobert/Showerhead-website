# EVERYDAY

Premium filtered shower systems — **Better Water. Better Life.**

## Live site

**https://belongarobert.github.io/Showerhead-website/**

Deploys automatically on push to `main` via GitHub Actions.

## Payments (Stripe Checkout)

Checkout uses **Stripe Checkout Sessions** (hosted payment page).

1. Copy `.env.example` → `.env` and add your Stripe **test** keys.
2. Run the storefront + API together:

```bash
npm install
npm run dev
```

- Web: Vite (`5173`)
- API: `http://127.0.0.1:8787` (`/api/create-checkout-session`, `/api/webhook`)

3. Click **Checkout** in the cart → redirects to Stripe’s secure payment page → returns to the site with a confirmation.

For production, host the API (Railway, Fly, Render, Cloudflare Workers, etc.), set `SITE_URL` to your live site, and set `VITE_CHECKOUT_API_URL` to the API origin when building the frontend. Add `STRIPE_WEBHOOK_SECRET` and point Stripe webhooks to `/api/webhook`.

## Custom domain (when ready)

1. In repo **Settings → Pages**, set your domain (e.g. `everydaywater.co`).
2. At your DNS host, add the records GitHub shows (usually `A` + `CNAME`).
3. Change `base` in `vite.config.ts` from `'/Showerhead-website/'` to `'/'`, then push to `main`.

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```
