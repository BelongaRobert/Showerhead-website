import { useMemo, useState, type ReactNode } from 'react'
import './App.css'

/** Public assets on GitHub Pages live under import.meta.env.BASE_URL (e.g. /Showerhead-website/). */
const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const CHROME_GALLERY = [
  { src: asset('/images/chrome-side.jpg'), alt: 'EVERYDAY filtered shower system — polished chrome side view' },
  { src: asset('/images/chrome-face.jpg'), alt: 'EVERYDAY polished chrome face showing spray nozzles' },
]

const BLACK_GALLERY = [
  { src: asset('/images/black-side.jpg'), alt: 'EVERYDAY filtered shower system — matte black side view' },
  { src: asset('/images/black-side-alt.jpg'), alt: 'EVERYDAY matte black side angle with EVERYDAY branding' },
  { src: asset('/images/black-face.jpg'), alt: 'EVERYDAY matte black face showing spray nozzles' },
]

const COLORS = [
  { id: 'chrome', label: 'Polished Chrome', image: asset('/images/chrome-side.jpg') },
  { id: 'black', label: 'Matte Black', image: asset('/images/black-side.jpg') },
] as const

const REVIEWS = [
  {
    name: 'Sophia R.',
    date: 'Aug 26, 2026',
    body: 'The water pressure is amazing and the filter works. My hair and skin are noticeably healthier after a couple of weeks.',
    verified: true,
  },
  {
    name: 'Marcus T.',
    date: 'Aug 16, 2026',
    body: 'Twist-on install took five minutes. Hair feels less brittle and the chlorine smell from our tap is gone.',
    verified: true,
  },
  {
    name: 'Elena K.',
    date: 'Aug 4, 2026',
    body: 'I was skeptical about filtered showerheads. EVERYDAY keeps flow high while the water finally feels clean.',
    verified: false,
  },
  {
    name: 'Jordan P.',
    date: 'Jul 17, 2026',
    body: 'Hard water was irritating my scalp. After a month soap rinses cleaner and my skin calmed down.',
    verified: true,
  },
  {
    name: 'Avery L.',
    date: 'Jul 4, 2026',
    body: 'Looks premium in our guest bath. Pressure stayed strong and showers feel like a small daily luxury.',
    verified: false,
  },
  {
    name: 'Chris M.',
    date: 'Jun 24, 2026',
    body: 'Skin feels less tight after showers. Easy setup, well made, and we are ordering a second for the kids’ bath.',
    verified: true,
  },
]

const FAQS = [
  {
    q: 'How often should I replace the filter?',
    a: 'Replace the cartridge every 90 days for optimal filtration. Autoship delivers refills on that cadence so you never miss a swap.',
  },
  {
    q: 'Will water pressure drop?',
    a: 'No. EVERYDAY is engineered for high flow — wide-face coverage with filtration running in parallel to your shower stream.',
  },
  {
    q: 'Does the filter actually work?',
    a: 'Yes. Multi-stage media is tested for chlorine reduction across a 3-month lifespan, including high-volume water throughput.',
  },
  {
    q: 'Will it fit my shower?',
    a: 'It installs on standard shower arms with a few twists. Plumber’s tape and a fit wrench are included.',
  },
  {
    q: 'What is Autoship?',
    a: 'Autoship pairs your shower system with carbon filter refills — discounted today and on every future shipment. Pause or cancel anytime.',
  },
]

const CAUSES = [
  {
    title: 'Skin breakouts',
    copy: 'Chlorine and mineral buildup can clog pores and disrupt the skin barrier, triggering irritation.',
  },
  {
    title: 'Weak & thinning hair',
    copy: 'Hard water minerals dry the scalp and weaken hair at the root over time.',
  },
  {
    title: 'Dry, red, itchy skin',
    copy: 'Chlorine strips natural oils, leaving skin tight, inflamed, and uncomfortable after showers.',
  },
  {
    title: 'Brittle, dull hair',
    copy: 'Chemical residue removes moisture, leading to breakage, tangles, and faded color.',
  },
]

const TICKER = [
  'Smoother Skin',
  'Less Breakouts',
  'Softer Hair',
  'Fewer Flares',
  'High-Flow Pressure',
  'Cleaner Water',
]

type PurchasePlan = 'bundle' | 'one'
type QtyOption = 'one' | 'multi'
type ColorId = (typeof COLORS)[number]['id']

type CartItem = {
  id: string
  color: ColorId
  colorLabel: string
  plan: PurchasePlan
  qty: number
  unitPrice: number
  image: string
}

function cartItemId(color: ColorId, plan: PurchasePlan) {
  return `${color}-${plan}`
}

function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 4C10.3 10.7 7 14.3 7 19a9 9 0 1 0 18 0c0-4.7-3.3-8.3-9-15Z" />
      <rect x="12" y="13" width="8" height="1.2" rx="0.6" />
      <rect x="12" y="15.8" width="8" height="1.2" rx="0.6" />
      <rect x="12" y="18.6" width="8" height="1.2" rx="0.6" />
    </svg>
  )
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M6.5 8h11l-.8 9.2a2 2 0 0 1-2 1.8H9.3a2 2 0 0 1-2-1.8L6.5 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6.8A3 3 0 0 1 12 3.8 3 3 0 0 1 15 6.8V8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function Stars({ value = 4.9 }: { value?: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      ★★★★★
    </span>
  )
}

function Check() {
  return (
    <svg className="check" viewBox="0 0 20 20" aria-hidden="true">
      <path d="M4.5 10.5 8 14l7.5-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Pill({ children }: { children: ReactNode }) {
  return <p className="pill">{children}</p>
}

function Accordion({
  title,
  open,
  onToggle,
  children,
}: {
  title: string
  open: boolean
  onToggle: () => void
  children: ReactNode
}) {
  return (
    <div className="accordion">
      <button type="button" aria-expanded={open} onClick={onToggle}>
        {title}
        <span aria-hidden="true">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="accordion-panel">{children}</div> : null}
    </div>
  )
}

function App() {
  const [slide, setSlide] = useState(0)
  const [color, setColor] = useState<ColorId>('chrome')
  const [qtyOption, setQtyOption] = useState<QtyOption>('one')
  const [plan, setPlan] = useState<PurchasePlan>('bundle')
  const [qty, setQty] = useState(1)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [openInfo, setOpenInfo] = useState<string | null>(null)
  const [added, setAdded] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [reviewCount, setReviewCount] = useState(4)
  const [cart, setCart] = useState<CartItem[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [checkout, setCheckout] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  })

  const units = plan === 'one' ? 1 : Math.max(1, qty)
  const listPrice = 199
  const unitPrice = useMemo(() => {
    if (plan === 'one') return listPrice
    return qtyOption === 'multi' || qty >= 2 ? 99 : 129
  }, [plan, qtyOption, qty])

  const lineTotal = unitPrice * units
  const savings = listPrice * units - lineTotal
  const gallery = color === 'black' ? BLACK_GALLERY : CHROME_GALLERY
  const colorImage = COLORS.find((c) => c.id === color)?.image ?? gallery[0].src
  const colorLabel = COLORS.find((c) => c.id === color)?.label ?? 'Polished Chrome'
  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0)
  const cartSubtotal = cart.reduce((sum, item) => sum + item.unitPrice * item.qty, 0)
  const shipping = cartSubtotal >= 99 || cartSubtotal === 0 ? 0 : 9
  const cartTotal = cartSubtotal + shipping

  function selectColor(id: ColorId) {
    setColor(id)
    setSlide(0)
  }

  function addToCart() {
    const id = cartItemId(color, plan)
    setCart((items) => {
      const existing = items.find((item) => item.id === id)
      if (existing) {
        return items.map((item) =>
          item.id === id ? { ...item, qty: item.qty + units, unitPrice } : item,
        )
      }
      return [
        ...items,
        {
          id,
          color,
          colorLabel,
          plan,
          qty: units,
          unitPrice,
          image: colorImage,
        },
      ]
    })
    setAdded(true)
    setCartOpen(true)
    setCheckoutOpen(false)
    setOrderPlaced(false)
    window.setTimeout(() => setAdded(false), 2200)
  }

  function updateCartQty(id: string, nextQty: number) {
    setCart((items) =>
      items
        .map((item) => (item.id === id ? { ...item, qty: nextQty } : item))
        .filter((item) => item.qty > 0),
    )
  }

  function removeFromCart(id: string) {
    setCart((items) => items.filter((item) => item.id !== id))
  }

  function openCheckout() {
    if (cart.length === 0) return
    setCheckoutOpen(true)
    setOrderPlaced(false)
  }

  function placeOrder(event: React.FormEvent) {
    event.preventDefault()
    if (cart.length === 0) return
    setOrderPlaced(true)
    setCart([])
  }

  function closePanels() {
    setCartOpen(false)
    setCheckoutOpen(false)
  }

  function joinList(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setEmailSent(true)
    setEmail('')
  }

  function shiftSlide(dir: -1 | 1) {
    setSlide((s) => (s + dir + gallery.length) % gallery.length)
  }

  function closeMenu() {
    setMenuOpen(false)
  }

  return (
    <div className="site">
      <div className="announce">Free shipping on orders over $99 · Everybody. Everyday.</div>

      <header className="nav-wrap">
        <div className="nav">
          <button
            type="button"
            className="nav-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
          <nav className="nav-links" aria-label="Primary">
            <a href="#buy" onClick={closeMenu}>
              Shop
            </a>
            <a href="#science" onClick={closeMenu}>
              Science
            </a>
            <a href="#reviews" onClick={closeMenu}>
              Reviews
            </a>
          </nav>
          <a className="nav-brand" href="#top" aria-label="EVERYDAY home">
            <LogoMark className="nav-mark" />
            <span>EVERYDAY</span>
          </a>
          <div className="nav-actions">
            <button
              type="button"
              className="nav-cart"
              aria-label={cartCount ? `Open cart, ${cartCount} items` : 'Open cart'}
              onClick={() => {
                setCartOpen(true)
                setCheckoutOpen(false)
                setOrderPlaced(false)
              }}
            >
              <CartIcon className="nav-cart-icon" />
              {cartCount > 0 ? <span className="nav-cart-badge">{cartCount}</span> : null}
            </button>
            <a className="btn btn-nav" href="#buy">
              Shop Now
            </a>
          </div>
        </div>
        {menuOpen ? (
          <nav className="nav-drawer" aria-label="Mobile">
            <a href="#buy" onClick={closeMenu}>
              Shop
            </a>
            <a href="#benefits" onClick={closeMenu}>
              Benefits
            </a>
            <a href="#science" onClick={closeMenu}>
              Science
            </a>
            <a href="#reviews" onClick={closeMenu}>
              Reviews
            </a>
            <a href="#faq" onClick={closeMenu}>
              FAQ
            </a>
          </nav>
        ) : null}
      </header>

      <main id="top">
        <section className="pdp" id="buy" aria-label="Product">
          <div className="pdp-grid">
            <div className="gallery">
              <div className="gallery-main">
                <button
                  type="button"
                  className="gallery-arrow prev"
                  aria-label="Previous image"
                  onClick={() => shiftSlide(-1)}
                >
                  ‹
                </button>
                <img key={gallery[slide].src} src={gallery[slide].src} alt={gallery[slide].alt} />
                <button
                  type="button"
                  className="gallery-arrow next"
                  aria-label="Next image"
                  onClick={() => shiftSlide(1)}
                >
                  ›
                </button>
              </div>
              <div className="gallery-dots" role="tablist" aria-label="Product images">
                {gallery.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    role="tab"
                    aria-label={`Image ${index + 1}`}
                    aria-selected={slide === index}
                    className={slide === index ? 'is-active' : undefined}
                    onClick={() => setSlide(index)}
                  />
                ))}
              </div>
            </div>

            <div className="buybox">
              <h1>Everyday Shower System</h1>
              <p className="buybox-lede">
                A premium multi-stage shower filter that removes chlorine and harsh
                contaminants from tap water —{' '}
                <strong>for healthier hair and skin.</strong>
              </p>
              <div className="rating-row">
                <Stars />
                <a href="#reviews">4.9 (128 Reviews)</a>
              </div>

              <div className="buybox-card">
                <fieldset className="option-block">
                  <legend>Select Color:</legend>
                  <div className="color-options">
                    {COLORS.map((c) => (
                      <label
                        key={c.id}
                        className={`choice-card color-option ${color === c.id ? 'is-selected' : ''}`}
                      >
                        <input
                          type="radio"
                          name="color"
                          value={c.id}
                          checked={color === c.id}
                          onChange={() => selectColor(c.id)}
                        />
                        <img src={c.image} alt="" />
                        <span>{c.label}</span>
                      </label>
                    ))}
                  </div>
                </fieldset>

                <fieldset className="option-block">
                  <legend>Quantity</legend>
                  <div className="qty-options">
                    <button
                      type="button"
                      className={`choice-card qty-card ${qtyOption === 'one' ? 'is-selected' : ''}`}
                      onClick={() => {
                        setQtyOption('one')
                        setQty(1)
                        setPlan('bundle')
                      }}
                    >
                      <span className="radio" aria-hidden="true" />
                      <img src={colorImage} alt="" />
                      <div className="qty-copy">
                        <strong>1 Showerhead</strong>
                        <span className="price-line">
                          <em>$129</em> Each
                        </span>
                      </div>
                      <span className="save-chip">Save $70</span>
                    </button>
                    <button
                      type="button"
                      className={`choice-card qty-card qty-card--value ${qtyOption === 'multi' ? 'is-selected' : ''}`}
                      onClick={() => {
                        setQtyOption('multi')
                        setQty((q) => Math.max(2, q))
                        setPlan('bundle')
                      }}
                    >
                      <span className="best-badge">50% off · Best value</span>
                      <span className="radio" aria-hidden="true" />
                      <img src={colorImage} alt="" />
                      <div className="qty-copy">
                        <strong>2+ Showerheads</strong>
                        <span className="price-line">
                          <em>$99</em> Each
                        </span>
                      </div>
                      <span className="save-chip">Save $200</span>
                    </button>
                  </div>
                </fieldset>

                {qtyOption === 'multi' ? (
                  <div className="qty-stepper">
                    <span>Units</span>
                    <div className="stepper">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() =>
                          setQty((q) => {
                            const next = Math.max(2, q - 1)
                            return next
                          })
                        }
                      >
                        −
                      </button>
                      <span aria-live="polite">{qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => setQty((q) => q + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : null}

                <fieldset className="option-block">
                  <legend>Subscription</legend>
                  <div className="plan-options">
                    <button
                      type="button"
                      className={`choice-card plan-card ${plan === 'bundle' ? 'is-selected' : ''}`}
                      onClick={() => setPlan('bundle')}
                    >
                      <div className="plan-top">
                        <span className="radio" aria-hidden="true" />
                        <strong>Autoship</strong>
                        <span className="plan-price">
                          <s>$199</s> <em>${unitPrice}</em>
                        </span>
                        {savings > 0 ? <span className="save-chip">Save ${savings}</span> : null}
                      </div>
                      <ul>
                        <li>
                          <Check /> Shower system + carbon filter subscription
                        </li>
                        <li>
                          <Check /> Replacement filters every 90 days ($29)
                        </li>
                        <li>
                          <Check /> Pause or cancel anytime
                        </li>
                      </ul>
                      <div className="popular-bar">Most popular option</div>
                    </button>
                    <button
                      type="button"
                      className={`choice-card plan-card ${plan === 'one' ? 'is-selected' : ''}`}
                      onClick={() => setPlan('one')}
                    >
                      <div className="plan-top">
                        <span className="radio" aria-hidden="true" />
                        <strong>One-time purchase</strong>
                        <span className="plan-price">
                          <em>$199</em>
                        </span>
                      </div>
                    </button>
                  </div>
                </fieldset>

                <p className="price-note">*Price updates with color, quantity, and Autoship.</p>

                <button
                  type="button"
                  className={`btn btn-cart ${added ? 'is-added' : ''}`}
                  onClick={addToCart}
                >
                  {added ? 'Added to cart' : `Add to cart · $${lineTotal}`}
                </button>

                <div className="perk-row">
                  <span>
                    <Check /> In stock
                  </span>
                  <span>Ships within 2 business days</span>
                </div>
                <ul className="perk-list">
                  <li>
                    <Check /> Chlorine-tested filter
                  </li>
                  <li>
                    <Check /> 60-day money-back guarantee
                  </li>
                  <li>
                    <Check /> Pause or cancel Autoship anytime
                  </li>
                </ul>
              </div>

              <div className="info-accordions">
                {(
                  [
                    {
                      id: 'overview',
                      title: 'Overview',
                      body: (
                        <ul>
                          <li>85% avg chlorine reduction across a 3-month filter lifespan</li>
                          <li>High-flow pressure with wide-face coverage</li>
                          <li>Universal quick install on standard shower arms</li>
                          <li>Designed for healthier skin, hair, and daily comfort</li>
                          <li>Multi-stage media including KDF-55 and calcium sulfite</li>
                        </ul>
                      ),
                    },
                    {
                      id: 'design',
                      title: 'Product design & performance',
                      body: (
                        <ul>
                          <li>Wide face · high-flow engineering</li>
                          <li>Replace filter every 90 days</li>
                          <li>KDF-55 + calcium sulfite multi-stage media</li>
                          <li>Targets chlorine and common shower contaminants</li>
                          <li>Over 250g of filtration media in every cartridge</li>
                        </ul>
                      ),
                    },
                    {
                      id: 'included',
                      title: "What's included",
                      body: (
                        <ul>
                          <li>EVERYDAY filtered shower system</li>
                          <li>Pre-installed filter cartridge</li>
                          <li>Plumber’s tape + fit wrench</li>
                          <li>Owner’s manual</li>
                        </ul>
                      ),
                    },
                  ] as const
                ).map((item) => (
                  <Accordion
                    key={item.id}
                    title={item.title}
                    open={openInfo === item.id}
                    onToggle={() => setOpenInfo((cur) => (cur === item.id ? null : item.id))}
                  >
                    {item.body}
                  </Accordion>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section reviews" id="reviews">
          <Pill>Testimonials</Pill>
          <h2 className="display">Real lives changed</h2>
          <div className="reviews-toolbar">
            <div className="rating-row">
              <Stars />
              <span>4.9 · 128 Reviews</span>
            </div>
          </div>
          <div className="review-grid">
            {REVIEWS.slice(0, reviewCount).map((review) => (
              <article key={review.name} className="review-card">
                <header>
                  <strong>{review.name}</strong>
                  {review.verified ? <span className="verified">Verified</span> : null}
                  <span>{review.date}</span>
                </header>
                <Stars />
                <p>{review.body}</p>
              </article>
            ))}
          </div>
          {reviewCount < REVIEWS.length ? (
            <button type="button" className="btn btn-outline" onClick={() => setReviewCount(REVIEWS.length)}>
              Load more
            </button>
          ) : null}
        </section>

        <section className="section benefits" id="benefits">
          <Pill>A healthier you</Pill>
          <h2 className="display">You’ll experience</h2>
          <div className="benefit-grid">
            <article>
              <img src={asset('/images/benefit-skin.jpg')} alt="" />
              <h3>Clearer skin</h3>
              <p>Smoother, more hydrated skin with fewer breakouts and irritation.</p>
            </article>
            <article>
              <img src={asset('/images/benefit-hair.jpg')} alt="" />
              <h3>Stronger hair</h3>
              <p>Protects natural moisture and color with less shedding and breakage.</p>
            </article>
            <article>
              <img src={asset('/images/benefit-pressure.jpg')} alt="" />
              <h3>High-flow water pressure</h3>
              <p>Powerful coverage without sacrificing filtration performance.</p>
            </article>
          </div>
          <div className="stat-cards">
            <article>
              <strong>93%</strong>
              <p>felt less dryness in 30 days</p>
            </article>
            <article>
              <strong>94%</strong>
              <p>saw less hair shedding in 30 days</p>
            </article>
            <article>
              <strong>100%</strong>
              <p>reported a better shower experience</p>
            </article>
          </div>
          <p className="disclaimer">
            *Based on an external consumer perception study of 100 participants over 30 days. Results may vary.
          </p>
          <a className="btn btn-nav benefit-cta" href="#buy">
            Add to cart
          </a>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {[...TICKER, ...TICKER].map((item, index) => (
              <span key={`${item}-${index}`}>
                {item}
                <i>|</i>
              </span>
            ))}
          </div>
        </div>

        <section className="section problem" id="problem">
          <Pill>The problem</Pill>
          <h2 className="display">Your water isn’t as clean as it looks</h2>
          <div className="problem-grid">
            <figure>
              <img
                src={asset('/images/problem-pipe.jpg')}
                alt="Corroded pipe interior showing scale and rust buildup"
              />
            </figure>
            <div>
              <p className="lede">
                Millions of homes rely on aging plumbing lined with rust, scale, and bacteria
                buildup — which is exactly why cleaner shower water matters every day.
              </p>
              <ul className="stat-list">
                <li>
                  <strong>95%</strong>
                  <span>of U.S. water sources exceeded safe thresholds for at least one carcinogen</span>
                </li>
                <li>
                  <strong>80%</strong>
                  <span>of U.S. homes have detectable chlorine and heavy metals in tap water</span>
                </li>
                <li>
                  <strong>45%</strong>
                  <span>of U.S. tap systems contain PFAS “forever chemicals”</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="section causes">
          <h2 className="causes-title">
            Unfiltered water <em>causes:</em>
          </h2>
          <div className="cause-grid">
            {CAUSES.map((cause) => (
              <article key={cause.title}>
                <h3>{cause.title}</h3>
                <p>{cause.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section science" id="science">
          <Pill>Tested & proven</Pill>
          <h2 className="display">Best-in-class filtration</h2>
          <div className="science-grid">
            <article>
              <strong>85%</strong>
              <p>avg chlorine reduction across the filter’s 3-month lifespan</p>
            </article>
            <article>
              <strong>75%</strong>
              <p>avg chlorine reduction after 10,000 gallons of water</p>
            </article>
            <article>
              <strong>15</strong>
              <p>filtration stages in every cartridge</p>
            </article>
            <article>
              <strong>250g+</strong>
              <p>calcium sulfite &amp; KDF-55 filtration media</p>
            </article>
          </div>
        </section>

        <section className="section faq" id="faq">
          <h2 className="display display--dark">Frequently asked</h2>
          <div className="faq-list">
            {FAQS.map((item, index) => (
              <Accordion
                key={item.q}
                title={item.q}
                open={openFaq === index}
                onToggle={() => setOpenFaq((cur) => (cur === index ? null : index))}
              >
                <p>{item.a}</p>
              </Accordion>
            ))}
          </div>
        </section>

        <section className="newsletter" id="newsletter">
          <div className="newsletter-inner">
            <Pill>Stay in the loop</Pill>
            <h2 className="display">Cleaner water updates, to your inbox.</h2>
            <p className="newsletter-lede">
              Product drops, filter reminders, and launch offers — no spam, unsubscribe anytime.
            </p>
            {emailSent ? (
              <p className="newsletter-success" role="status">
                You&apos;re on the list. Welcome to EVERYDAY.
              </p>
            ) : (
              <form className="newsletter-form" onSubmit={joinList}>
                <label className="sr-only" htmlFor="newsletter-email">
                  Email address
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
                <button type="submit" className="btn btn-nav">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">
              <LogoMark className="footer-mark" />
              EVERYDAY
            </p>
            <p className="footer-tag">Everybody. Everyday.</p>
            <p>Better water for every shower in your home.</p>
          </div>
          <div>
            <h3>Shop</h3>
            <a href="#buy">Filtered Shower System</a>
            <a href="#buy">Carbon Filters</a>
          </div>
          <div>
            <h3>Support</h3>
            <a href="#faq">FAQ</a>
            <a href="#science">Filtration</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:hello@everydaywater.co">hello@everydaywater.co</a>
          </div>
        </div>
        <p className="footer-copy">© {new Date().getFullYear()} EVERYDAY. All rights reserved.</p>
      </footer>

      <div className="mobile-cart">
        <button
          type="button"
          className={`btn btn-cart ${added ? 'is-added' : ''}`}
          onClick={addToCart}
        >
          {added ? 'Added' : `Add to cart · $${lineTotal}`}
        </button>
      </div>

      {cartOpen ? (
        <div className="cart-overlay" role="presentation" onClick={closePanels}>
          <aside
            className="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-label={checkoutOpen ? 'Checkout' : 'Shopping cart'}
            onClick={(event) => event.stopPropagation()}
          >
            <header className="cart-drawer-head">
              <div>
                <p className="eyebrow">{checkoutOpen ? 'Checkout' : 'Your cart'}</p>
                <h2>{checkoutOpen ? 'Complete your order' : `${cartCount} item${cartCount === 1 ? '' : 's'}`}</h2>
              </div>
              <button type="button" className="cart-close" aria-label="Close" onClick={closePanels}>
                ✕
              </button>
            </header>

            {orderPlaced ? (
              <div className="cart-empty cart-success">
                <LogoMark className="cart-success-mark" />
                <h3>Order received</h3>
                <p>
                  Thanks{checkout.name ? `, ${checkout.name.split(' ')[0]}` : ''}. We&apos;ll email
                  confirmation to {checkout.email || 'you'} shortly.
                </p>
                <button
                  type="button"
                  className="btn btn-nav"
                  onClick={() => {
                    closePanels()
                    setOrderPlaced(false)
                  }}
                >
                  Keep shopping
                </button>
              </div>
            ) : checkoutOpen ? (
              <form className="checkout-form" onSubmit={placeOrder}>
                <label>
                  Full name
                  <input
                    required
                    autoComplete="name"
                    value={checkout.name}
                    onChange={(e) => setCheckout((c) => ({ ...c, name: e.target.value }))}
                  />
                </label>
                <label>
                  Email
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={checkout.email}
                    onChange={(e) => setCheckout((c) => ({ ...c, email: e.target.value }))}
                  />
                </label>
                <label>
                  Street address
                  <input
                    required
                    autoComplete="street-address"
                    value={checkout.address}
                    onChange={(e) => setCheckout((c) => ({ ...c, address: e.target.value }))}
                  />
                </label>
                <div className="checkout-row">
                  <label>
                    City
                    <input
                      required
                      autoComplete="address-level2"
                      value={checkout.city}
                      onChange={(e) => setCheckout((c) => ({ ...c, city: e.target.value }))}
                    />
                  </label>
                  <label>
                    State
                    <input
                      required
                      autoComplete="address-level1"
                      value={checkout.state}
                      onChange={(e) => setCheckout((c) => ({ ...c, state: e.target.value }))}
                    />
                  </label>
                  <label>
                    ZIP
                    <input
                      required
                      autoComplete="postal-code"
                      value={checkout.zip}
                      onChange={(e) => setCheckout((c) => ({ ...c, zip: e.target.value }))}
                    />
                  </label>
                </div>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>${cartSubtotal}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? 'Free' : `$${shipping}`}</strong>
                  </div>
                  <div className="cart-summary-total">
                    <span>Total</span>
                    <strong>${cartTotal}</strong>
                  </div>
                </div>

                <p className="checkout-note">
                  Payment processing comes next — for now this confirms your order details.
                </p>

                <div className="cart-actions">
                  <button type="submit" className="btn btn-cart">
                    Place order · ${cartTotal}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setCheckoutOpen(false)}
                  >
                    Back to cart
                  </button>
                </div>
              </form>
            ) : cart.length === 0 ? (
              <div className="cart-empty">
                <p>Your cart is empty.</p>
                <button
                  type="button"
                  className="btn btn-nav"
                  onClick={() => {
                    closePanels()
                    document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Shop shower systems
                </button>
              </div>
            ) : (
              <>
                <ul className="cart-lines">
                  {cart.map((item) => (
                    <li key={item.id}>
                      <img src={item.image} alt="" />
                      <div>
                        <strong>EVERYDAY Shower System</strong>
                        <p>
                          {item.colorLabel} · {item.plan === 'bundle' ? 'Autoship' : 'One-time'}
                        </p>
                        <div className="cart-line-controls">
                          <div className="stepper cart-stepper">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateCartQty(item.id, item.qty - 1)}
                            >
                              −
                            </button>
                            <span aria-live="polite">{item.qty}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateCartQty(item.id, item.qty + 1)}
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            className="cart-remove"
                            onClick={() => removeFromCart(item.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <strong className="cart-line-price">${item.unitPrice * item.qty}</strong>
                    </li>
                  ))}
                </ul>

                <div className="cart-summary">
                  <div>
                    <span>Subtotal</span>
                    <strong>${cartSubtotal}</strong>
                  </div>
                  <div>
                    <span>Shipping</span>
                    <strong>{shipping === 0 ? 'Free' : `$${shipping}`}</strong>
                  </div>
                  <div className="cart-summary-total">
                    <span>Total</span>
                    <strong>${cartTotal}</strong>
                  </div>
                </div>

                <div className="cart-actions">
                  <button type="button" className="btn btn-cart" onClick={openCheckout}>
                    Checkout · ${cartTotal}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={closePanels}>
                    Continue shopping
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      ) : null}
    </div>
  )
}

export default App
