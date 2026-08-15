# Loop Subscriptions + Shop Order Tracking

**Audience:** business partner + implementing agent  
**Scope:** Shopify admin + theme app blocks. Do **not** invent custom subscription billing code.  
**Status:** implementation checklist (not yet done in this repo)

Related product context lives on theme branch `cursor/shopify-theme-36e5` (Drop Lab / FLOW 01). This doc is store-ops setup that sits on top of that theme.

---

## Goals

1. **Loop Subscriptions** — customers can buy one-time **or** subscribe (Subscribe & Save) on product pages; manage/cancel in Loop’s customer portal.
2. **Shop order tracking** — every fulfilled shipment has a tracking number + carrier so customers get updates via order status page, shipping emails, and the **Shop** app (“Track with Shop”).

---

## Prerequisites (do these first)

- [ ] Shopify store live with products published (FLOW 01 / showerhead SKUs ready).
- [ ] Online Store 2.0 theme published (prefer the Drop Lab theme from `cursor/shopify-theme-36e5`).
- [ ] Supported payment gateway enabled (Shopify Payments recommended). Subscriptions require a Shopify-compatible gateway that supports recurring charges.
- [ ] Shop Pay enabled under **Settings → Payments** (helps Shop sync + checkout).
- [ ] Shipping rates already decided for early units (flat / threshold free ship is fine).
- [ ] Refund policy published in Shopify (**Settings → Policies**) so subscription + one-time buyers see consistent rules.

Official refs:

- Loop getting started: https://help.loopwork.co/en/articles/12703816-getting-started-with-loop
- Loop selling-plan mapping: https://help.loopwork.co/en/articles/12716791-mapping-products-to-selling-plan
- Loop widget setup: https://help.loopwork.co/en/articles/12729262-setting-up-the-loop-subscription-widget
- Shop channel setup: https://help.shopify.com/en/manual/online-sales-channels/shop/setup
- Shop delivery tracking: https://help.shopify.com/en/manual/online-sales-channels/shop/delivery-tracking
- Shopify order tracking: https://help.shopify.com/en/manual/fulfillment/setup/order-status-page/order-tracking

---

## Part A — Loop Subscriptions

### A1. Install Loop

1. Shopify admin → **Apps** → Shopify App Store.
2. Search **Loop Subscriptions** (Loop Work) → **Install**.
3. Approve requested permissions.
4. Open the Loop admin from **Apps**.

### A2. Choose the subscription model

Recommended launch model for this brand:

| Decision | Recommendation |
| --- | --- |
| Purchase options | **One-time and subscription** (do not force subscribe-only at launch) |
| Frequencies | Start simple: e.g. **Every 30 / 60 / 90 days** (filters / replacement heads — adjust to real consume rate) |
| Discount | e.g. **10–15% Subscribe & Save** vs one-time |
| Prepaid / gift / trial | Skip for v1 unless already decided |

Document the final frequency + discount numbers in the PR or Notion once locked — agents should not invent discounts without owner confirmation.

### A3. Create a selling plan in Loop

In Loop admin:

1. Create a **selling plan**.
2. Set customer-facing name (e.g. `Subscribe & Save`).
3. Set plan selector title (e.g. `Delivery every`).
4. Add billing/delivery frequencies and discount %.
5. Save.

### A4. Map products (or collections)

1. Open the selling plan → **Add products** (or **Collections**).
2. Map FLOW 01 / any refill or filter SKUs that should allow subscribe.
3. Confirm each mapped product shows subscription options in Loop’s product list.

### A5. Install the Loop widget on the theme

Prefer **app block** (Online Store 2.0) — no custom liquid unless the theme blocks it.

**Theme status (Dr. Droppy):** `sections/product-buybox.liquid` on `cursor/shopify-theme-36e5` now supports `@app` blocks and renders them **above Add to cart** on the product page. After this theme is published, Loop’s “No product templates eligible…” warning should clear — then add the Loop widget via Theme editor → Product page → Product buy box → Add block → Apps.

1. Loop admin → **Acquire → Widget** (or Widgets) → **Create / configure widget**.
2. Match brand styles lightly (button, copy like `Subscribe & Save 15%`). Keep layout clean — one purchase-option control near Add to Cart.
3. Map widget to the **product** template(s) used by FLOW 01.
4. Use **Add app block** so Shopify theme editor places the Loop block on the product page (typically above quantity / ATC).
5. **Save** theme → back in Loop click **Refresh status** → confirm templates show as installed.
6. If using a page builder (GemPages etc.), follow that builder’s Loop placement rules; widget only shows on products mapped to a selling plan.

### A6. Customer portal + emails

1. Enable Loop **customer portal** (self-serve skip / swap / cancel as allowed by plan).
2. Add portal entry points:
   - Customer account page link, and/or
   - Footer / Order confirmation email link via Loop’s portal link snippet if provided.
3. Review Loop notification emails (subscription created, upcoming order, payment failed / dunning).
4. Align cancellation wording with the store **refund policy** (shipped cycles follow product refund rules; unshipped future cycles cancel/refund per Loop settings).

### A7. QA checklist (Loop)

- [ ] Product page shows **One-time** vs **Subscribe** options.
- [ ] Choosing subscribe applies correct discount and selling plan in cart/checkout.
- [ ] Checkout completes; order tagged/recognized as subscription in Loop.
- [ ] Test customer can open portal and cancel or skip.
- [ ] Mobile product page: widget does not break buy box layout.
- [ ] One-time purchase still works with no subscription selected.

---

## Part B — Shop order tracking

### B1. Add / confirm Shop sales channel

1. Shopify admin → **Settings → Apps and sales channels** (or **Sales channels**).
2. Add **Shop** from the Shopify App Store if missing → **Install**.
3. Open **Sales channels → Shop → Settings**.
4. Confirm store profile basics (name, logo, policies links). Selling *on* Shop marketplace is optional; **tracking still matters** even if you only use Track with Shop.

### B2. Turn on Track with Shop in checkout

Track with Shop is **on by default** for Shopify stores. Confirm it explicitly:

1. **Settings → Checkout**.
2. Under **Customer contact method**, enable **Show a link for customers to track their order with Shop**.
3. Save.

Alternate path: **Sales channels → Shop → Settings → Track with Shop → Manage** (opens checkout settings).

### B3. Shipping notification emails

1. **Settings → Notifications → Customer notifications**.
2. Ensure these are enabled / sensible:
   - Shipping confirmation
   - Shipping update
   - Out for delivery (optional)
   - Delivered (optional)
3. Keep default Shopify templates unless copy is already customized — defaults include Shop tracking prompts.

### B4. Fulfillment SOP (critical for first few hundred units)

Whoever ships (you / 3PL / Pirate Ship labels) must always:

1. Create fulfillment in Shopify for the order.
2. Add **tracking number** + correct **carrier** (or tracking URL if carrier unknown).
3. Prefer buying labels **inside Shopify** when possible so tracking attaches automatically.
4. Partial ships: add a tracking number **per package**.
5. Never mark fulfilled without tracking during this early phase — Shop + order status page depend on it.

### B5. QA checklist (Shop tracking)

- [ ] Place a test order.
- [ ] Fulfill with a real or carrier-sandbox tracking number + carrier.
- [ ] Customer shipping email contains tracking.
- [ ] Order status page shows tracking + **Track with Shop** link (mobile/desktop as applicable).
- [ ] Shop app (customer install) shows the order after account sync / tracking add.
- [ ] Second package / partial fulfill updates separately.

---

## Part C — Agent implementation notes

When an agent implements this:

1. **Do not** replace Loop with custom subscription code.
2. **Do not** remove one-time purchase unless owners explicitly request subscribe-only.
3. Theme edits should be limited to:
   - Placing / styling the Loop app block on product templates
   - Optional customer portal link in account/footer
4. Prefer changes on the live Shopify theme (or theme branch `cursor/shopify-theme-36e5`) over this marketing-repo root unless owners say otherwise.
5. After setup, paste screenshots or a short “done” note under **Verification log** below.
6. If Loop widget conflicts with a custom buy box, fix placement/CSS — do not strip the existing product gallery/buy box structure.

### Suggested owner decisions before coding

- Final Subscribe & Save **discount %**
- Final **delivery frequencies**
- Which SKUs are subscription-eligible (head only vs filters/refills)
- Whether cancellation is immediate or end-of-cycle

---

## Verification log

| Item | Owner | Date | Result |
| --- | --- | --- | --- |
| Loop installed | | | |
| Selling plan live | | | |
| Products mapped | | | |
| Widget on product page | | | |
| Portal reachable | | | |
| Shop channel installed | | | |
| Track with Shop enabled | | | |
| Test order tracked end-to-end | | | |

---

## Out of scope (for later)

- Shipping rate calculator / landed-cost experiments for early self-fulfilled units
- Full refund policy legal pass
- Extra apps (Klaviyo flows for subscription lifecycle, Rebuy, reviews)
- Loop prepaid / gift / membership models
