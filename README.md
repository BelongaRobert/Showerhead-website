# EVERYDAY

Premium filtered shower systems — **Better Water. Better Life.**

## Live site

**https://belongarobert.github.io/Showerhead-website/**

Deploys automatically on push to `main` via GitHub Actions.

## Payments (Stripe Checkout)

Checkout uses **Stripe Checkout Sessions** (hosted payment page) with **Payments**, **Billing**, and **Tax** ready.

| Cart plan | Stripe mode | What is charged |
| --- | --- | --- |
| One-time | `payment` | Shower system (+ shipping if under $99) |
| Autoship | `subscription` | Discounted system (one-time) + **$29 filter refill every 90 days** |

1. Copy `.env.example` → `.env` and add your Stripe **test** restricted key (`rk_test_…`).
2. Run the storefront + API together:

```bash
npm install
npm run dev
```

- Web: Vite (`5173`)
- API: `http://127.0.0.1:8787`
  - `POST /api/create-checkout-session`
  - `GET /api/checkout-session/:id`
  - `POST /api/customer-portal` (manage Autoship)
  - `POST /api/webhook`

3. Click **Checkout** in the cart → Stripe-hosted page → return with confirmation. Autoship buyers get **Manage Autoship** (Customer Portal).

### Stripe Tax

Set `STRIPE_AUTOMATIC_TAX=true` only after:

1. Dashboard → **Tax → Settings**: head office address (status `active`)
2. Dashboard → **Tax → Locations**: add a registration where you collect tax
3. Confirm product tax codes with your advisor (defaults: `txcd_33150006` showerheads, `txcd_99999999` refill)

Until a registration is **Collecting**, Stripe Tax calculates **$0** with no error.

### Production

Host the API (Railway, Fly, Render, etc.), set `SITE_URL` to the live site, set `VITE_CHECKOUT_API_URL` at build time, and point Stripe webhooks to `/api/webhook` with `STRIPE_WEBHOOK_SECRET`. Enable Customer Portal in the Stripe Dashboard (Billing → Customer portal).

Webhook events to handle (already logged in `server/index.ts`): `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.

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
