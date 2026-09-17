/**
 * EVERYDAY Stripe API — Payments + Billing + Tax
 *
 * - One-time purchases → Checkout Sessions (mode: payment)
 * - Autoship → Checkout Sessions (mode: subscription) with
 *   discounted system (one-time) + quarterly filter refill (recurring)
 * - Stripe Tax via automatic_tax when STRIPE_AUTOMATIC_TAX=true
 *   (requires Tax Settings head office + an active registration)
 * - Customer Portal for pause/cancel/update Autoship
 *
 * Secret keys must come from env — never from the frontend.
 */
import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import Stripe from 'stripe'
import { randomBytes } from 'node:crypto'

type CartLine = {
  color: 'chrome' | 'black'
  colorLabel: string
  plan: 'bundle' | 'one'
  qty: number
  unitPrice: number
}

const PORT = Number(process.env.PORT || 8787)
const SITE_URL = (process.env.SITE_URL || 'http://127.0.0.1:4173/Showerhead-website').replace(/\/$/, '')
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  'http://127.0.0.1:4173,http://localhost:4173,http://127.0.0.1:5173,http://localhost:5173,https://belongarobert.github.io'
)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const AUTOMATIC_TAX = /^(1|true|yes)$/i.test(process.env.STRIPE_AUTOMATIC_TAX || '')
/** Candidate codes from Stripe Tax Codes API — confirm with a tax advisor. */
const TAX_CODE_SHOWER = process.env.STRIPE_TAX_CODE_SHOWER || 'txcd_33150006' // Showerheads - WaterSense
const TAX_CODE_REFILL = process.env.STRIPE_TAX_CODE_REFILL || 'txcd_99999999' // General - Tangible Goods
const FILTER_REFILL_CENTS = Math.round(Number(process.env.STRIPE_FILTER_REFILL_AMOUNT || 29) * 100)

const secretKey = process.env.STRIPE_SECRET_KEY
if (!secretKey) {
  console.error('Missing STRIPE_SECRET_KEY')
  process.exit(1)
}

const stripe = new Stripe(secretKey, {
  apiVersion: '2026-08-26.dahlia',
  typescript: true,
  appInfo: {
    name: 'EVERYDAY Shower Systems',
    version: '1.1.0',
    url: 'https://belongarobert.github.io/Showerhead-website/',
  },
})

function randomSuffix(length = 8): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const bytes = randomBytes(length)
  let out = ''
  for (let i = 0; i < length; i++) out += alphabet[bytes[i] % alphabet.length]
  return out
}

function validateItems(items: CartLine[]): string | null {
  if (items.length === 0) return 'Cart is empty'
  for (const item of items) {
    if (!item || (item.color !== 'chrome' && item.color !== 'black')) return 'Invalid finish'
    if (item.plan !== 'bundle' && item.plan !== 'one') return 'Invalid purchase plan'
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 20) return 'Invalid quantity'
    if (!Number.isInteger(item.unitPrice) || item.unitPrice < 1 || item.unitPrice > 500) {
      return 'Invalid price'
    }
  }
  return null
}

const app = new Hono()

app.use(
  '*',
  cors({
    origin: (origin) => {
      if (!origin) return SITE_URL
      return ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
    },
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Stripe-Signature'],
  }),
)

app.get('/api/health', (c) =>
  c.json({
    ok: true,
    service: 'everyday-checkout',
    mode: secretKey.startsWith('sk_live') || secretKey.startsWith('rk_live') ? 'live' : 'test',
    automaticTax: AUTOMATIC_TAX,
    filterRefillCents: FILTER_REFILL_CENTS,
  }),
)

app.post('/api/create-checkout-session', async (c) => {
  let body: { items?: CartLine[]; customerEmail?: string }
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  const items = Array.isArray(body.items) ? body.items : []
  const validationError = validateItems(items)
  if (validationError) return c.json({ error: validationError }, 400)

  const hasAutoship = items.some((item) => item.plan === 'bundle')
  const mode: Stripe.Checkout.SessionCreateParams.Mode = hasAutoship ? 'subscription' : 'payment'

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  const shippingAmount = subtotal >= 99 ? 0 : 9

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = []

  for (const item of items) {
    const planLabel = item.plan === 'bundle' ? 'Autoship' : 'One-time'
    line_items.push({
      quantity: item.qty,
      price_data: {
        currency: 'usd',
        unit_amount: item.unitPrice * 100,
        tax_behavior: 'exclusive',
        product_data: {
          name: 'EVERYDAY Filtered Shower System',
          description: `${item.colorLabel} · ${planLabel}`,
          tax_code: TAX_CODE_SHOWER,
          metadata: {
            color: item.color,
            plan: item.plan,
          },
        },
      },
    })

    // Autoship: enroll each system in quarterly filter refills (Billing)
    if (item.plan === 'bundle') {
      line_items.push({
        quantity: item.qty,
        price_data: {
          currency: 'usd',
          unit_amount: FILTER_REFILL_CENTS,
          recurring: { interval: 'month', interval_count: 3 },
          tax_behavior: 'exclusive',
          product_data: {
            name: 'EVERYDAY Carbon Filter Refill',
            description: 'Ships every 90 days · pause or cancel anytime',
            tax_code: TAX_CODE_REFILL,
            metadata: {
              color: item.color,
              plan: 'bundle',
              kind: 'filter_refill',
            },
          },
        },
      })
    }
  }

  if (shippingAmount > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: shippingAmount * 100,
        tax_behavior: 'exclusive',
        product_data: {
          name: 'Shipping',
          description: 'Standard shipping (free on orders $99+)',
          tax_code: TAX_CODE_REFILL,
        },
      },
    })
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode,
    line_items,
    customer_email: body.customerEmail || undefined,
    shipping_address_collection: {
      allowed_countries: ['US'],
    },
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true,
    success_url: `${SITE_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${SITE_URL}/?checkout=cancel`,
    integration_identifier: `everyday_${mode}_${randomSuffix(8)}`,
    metadata: {
      brand: 'EVERYDAY',
      checkout_mode: mode,
      item_count: String(items.reduce((n, i) => n + i.qty, 0)),
      has_autoship: String(hasAutoship),
    },
  }

  // With Stripe Tax + shipping address, billing_address_collection is unnecessary friction.
  // Keep it for payment-only flows without automatic tax.
  if (!AUTOMATIC_TAX) {
    sessionParams.billing_address_collection = 'required'
  }

  if (AUTOMATIC_TAX) {
    sessionParams.automatic_tax = { enabled: true }
  }

  if (mode === 'subscription') {
    sessionParams.subscription_data = {
      metadata: {
        brand: 'EVERYDAY',
        source: 'everyday_storefront',
      },
    }
  }

  try {
    const session = await stripe.checkout.sessions.create(sessionParams)

    if (!session.url) {
      return c.json({ error: 'Stripe did not return a checkout URL' }, 502)
    }

    return c.json({ url: session.url, id: session.id, mode })
  } catch (error) {
    console.error('Checkout session error', error)
    const message = error instanceof Error ? error.message : 'Unable to start checkout'
    return c.json({ error: message }, 500)
  }
})

app.get('/api/checkout-session/:id', async (c) => {
  const id = c.req.param('id')
  if (!id.startsWith('cs_')) {
    return c.json({ error: 'Invalid session id' }, 400)
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ['subscription', 'customer'],
    })
    const subscription =
      typeof session.subscription === 'object' && session.subscription
        ? session.subscription
        : null
    const customerId =
      typeof session.customer === 'string'
        ? session.customer
        : session.customer && typeof session.customer === 'object'
          ? session.customer.id
          : null

    return c.json({
      id: session.id,
      mode: session.mode,
      status: session.status,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email ?? session.customer_email,
      customer_name: session.customer_details?.name,
      customer_id: customerId,
      subscription_id: subscription?.id ?? (typeof session.subscription === 'string' ? session.subscription : null),
      automatic_tax: session.automatic_tax?.status ?? null,
    })
  } catch (error) {
    console.error('Session retrieve error', error)
    return c.json({ error: 'Session not found' }, 404)
  }
})

/** Opens Stripe Customer Portal so buyers can manage Autoship. */
app.post('/api/customer-portal', async (c) => {
  let body: { sessionId?: string; customerId?: string }
  try {
    body = await c.req.json()
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400)
  }

  let customerId = body.customerId?.startsWith('cus_') ? body.customerId : null

  if (!customerId && body.sessionId?.startsWith('cs_')) {
    try {
      const session = await stripe.checkout.sessions.retrieve(body.sessionId)
      customerId =
        typeof session.customer === 'string'
          ? session.customer
          : session.customer && typeof session.customer === 'object'
            ? session.customer.id
            : null
    } catch {
      return c.json({ error: 'Checkout session not found' }, 404)
    }
  }

  if (!customerId) {
    return c.json({ error: 'Customer not found for portal' }, 400)
  }

  try {
    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: SITE_URL,
    })
    return c.json({ url: portal.url })
  } catch (error) {
    console.error('Customer portal error', error)
    const message = error instanceof Error ? error.message : 'Unable to open customer portal'
    return c.json({ error: message }, 500)
  }
})

app.post('/api/webhook', async (c) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = c.req.header('stripe-signature')
  const payload = await c.req.text()
  const requireSignature = process.env.NODE_ENV === 'production' || Boolean(webhookSecret)

  let event: Stripe.Event
  try {
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret)
    } else if (!requireSignature) {
      event = JSON.parse(payload) as Stripe.Event
      console.warn('Webhook accepted without signature verification (set STRIPE_WEBHOOK_SECRET)')
    } else {
      return c.json({ error: 'Missing webhook signature' }, 400)
    }
  } catch (error) {
    console.error('Webhook signature failed', error)
    return c.json({ error: 'Invalid signature' }, 400)
  }

  switch (event.type) {
    case 'checkout.session.completed':
    case 'checkout.session.async_payment_succeeded': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.payment_status === 'paid' || session.payment_status === 'no_payment_required') {
        console.log(
          JSON.stringify({
            type: 'order_paid',
            session_id: session.id,
            mode: session.mode,
            email: session.customer_details?.email ?? session.customer_email,
            amount_total: session.amount_total,
            currency: session.currency,
            subscription: session.subscription,
          }),
        )
      }
      break
    }
    case 'checkout.session.async_payment_failed': {
      const session = event.data.object as Stripe.Checkout.Session
      console.warn('Async payment failed', session.id)
      break
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      console.log(
        JSON.stringify({
          type: 'invoice_paid',
          invoice_id: invoice.id,
          customer: invoice.customer,
          subscription: (invoice as { subscription?: string | null }).subscription ?? null,
          amount_paid: invoice.amount_paid,
          billing_reason: invoice.billing_reason,
        }),
      )
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      console.warn(
        JSON.stringify({
          type: 'invoice_payment_failed',
          invoice_id: invoice.id,
          customer: invoice.customer,
          attempt_count: invoice.attempt_count,
        }),
      )
      break
    }
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      console.log(
        JSON.stringify({
          type: event.type,
          subscription_id: subscription.id,
          status: subscription.status,
          cancel_at_period_end: subscription.cancel_at_period_end,
          customer: subscription.customer,
        }),
      )
      break
    }
    default:
      break
  }

  return c.json({ received: true })
})

app.get('/api/config', (c) =>
  c.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    siteUrl: SITE_URL,
    automaticTax: AUTOMATIC_TAX,
    filterRefillAmount: FILTER_REFILL_CENTS / 100,
  }),
)

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`EVERYDAY checkout API listening on http://127.0.0.1:${info.port}`)
  console.log(`  automatic_tax=${AUTOMATIC_TAX} filter_refill=$${FILTER_REFILL_CENTS / 100}/90d`)
})
