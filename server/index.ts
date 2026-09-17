/**
 * EVERYDAY Stripe Checkout API
 * Creates Checkout Sessions and verifies webhooks.
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
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || 'http://127.0.0.1:4173,http://localhost:4173,http://127.0.0.1:5173,http://localhost:5173,https://belongarobert.github.io')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

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
    version: '1.0.0',
    url: 'https://belongarobert.github.io/Showerhead-website/',
  },
})

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
  if (items.length === 0) {
    return c.json({ error: 'Cart is empty' }, 400)
  }

  for (const item of items) {
    if (!item || (item.color !== 'chrome' && item.color !== 'black')) {
      return c.json({ error: 'Invalid finish' }, 400)
    }
    if (item.plan !== 'bundle' && item.plan !== 'one') {
      return c.json({ error: 'Invalid purchase plan' }, 400)
    }
    if (!Number.isInteger(item.qty) || item.qty < 1 || item.qty > 20) {
      return c.json({ error: 'Invalid quantity' }, 400)
    }
    if (!Number.isInteger(item.unitPrice) || item.unitPrice < 1 || item.unitPrice > 500) {
      return c.json({ error: 'Invalid price' }, 400)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  const shippingAmount = subtotal >= 99 ? 0 : 9

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item) => {
    const planLabel = item.plan === 'bundle' ? 'Autoship' : 'One-time'
    return {
      quantity: item.qty,
      price_data: {
        currency: 'usd',
        unit_amount: item.unitPrice * 100,
        product_data: {
          name: 'EVERYDAY Filtered Shower System',
          description: `${item.colorLabel} · ${planLabel}`,
          metadata: {
            color: item.color,
            plan: item.plan,
          },
        },
      },
    }
  })

  if (shippingAmount > 0) {
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'usd',
        unit_amount: shippingAmount * 100,
        product_data: {
          name: 'Shipping',
          description: 'Standard shipping (free on orders $99+)',
        },
      },
    })
  }

  const integrationSuffix = randomBytes(4).toString('hex')

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items,
      customer_email: body.customerEmail || undefined,
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: ['US'],
      },
      phone_number_collection: { enabled: true },
      allow_promotion_codes: true,
      success_url: `${SITE_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/?checkout=cancel`,
      integration_identifier: `everyday_checkout_${integrationSuffix}`,
      metadata: {
        brand: 'EVERYDAY',
        item_count: String(items.reduce((n, i) => n + i.qty, 0)),
      },
    })

    if (!session.url) {
      return c.json({ error: 'Stripe did not return a checkout URL' }, 502)
    }

    return c.json({ url: session.url, id: session.id })
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
    const session = await stripe.checkout.sessions.retrieve(id)
    return c.json({
      id: session.id,
      status: session.status,
      payment_status: session.payment_status,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_email: session.customer_details?.email ?? session.customer_email,
      customer_name: session.customer_details?.name,
    })
  } catch (error) {
    console.error('Session retrieve error', error)
    return c.json({ error: 'Session not found' }, 404)
  }
})

app.post('/api/webhook', async (c) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const signature = c.req.header('stripe-signature')
  const payload = await c.req.text()

  let event: Stripe.Event
  try {
    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret)
    } else {
      // Local/dev without webhook secret: parse only (never use this in production)
      event = JSON.parse(payload) as Stripe.Event
      console.warn('Webhook accepted without signature verification (set STRIPE_WEBHOOK_SECRET)')
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
            email: session.customer_details?.email ?? session.customer_email,
            amount_total: session.amount_total,
            currency: session.currency,
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
    default:
      break
  }

  return c.json({ received: true })
})

app.get('/api/config', (c) =>
  c.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || null,
    siteUrl: SITE_URL,
  }),
)

serve({ fetch: app.fetch, port: PORT }, (info) => {
  console.log(`EVERYDAY checkout API listening on http://127.0.0.1:${info.port}`)
})
