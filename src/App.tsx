import { useMemo, useState, type ReactNode } from 'react'
import './App.css'

const GALLERY = [
  { src: '/images/hero-showerhead.jpg', alt: 'EVERYDAY filtered shower system installed in a modern bathroom' },
  { src: '/images/gallery-1.jpg', alt: 'EVERYDAY shower head in polished chrome' },
  { src: '/images/gallery-2.jpg', alt: 'EVERYDAY shower head in matte black' },
  { src: '/images/product-detail.jpg', alt: 'EVERYDAY multi-stage filter face detail' },
  { src: '/images/gallery-3.jpg', alt: 'EVERYDAY replacement filter cartridge' },
]

const COLORS = [
  { id: 'chrome', label: 'Polished Chrome', image: '/images/gallery-1.jpg' },
  { id: 'black', label: 'Matte Black', image: '/images/gallery-2.jpg' },
] as const

const FEATURES = [
  {
    title: 'Cleaner Water',
    copy: 'Multi-stage filtration reduces chlorine and common tap contaminants.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 3C8 8 6 10.5 6 14a6 6 0 1 0 12 0c0-3.5-2-6-6-11Z" />
        <path d="M9.5 12.5h5M9.5 15h5M9.5 17.5h5" />
      </svg>
    ),
  },
  {
    title: 'Protects Skin & Hair',
    copy: 'Cleaner rinse for softer skin, stronger hair, and everyday comfort.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 4v6" />
        <path d="M8 10h8" />
        <path d="M6 18c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      </svg>
    ),
  },
  {
    title: 'Whole Home Solution',
    copy: 'Universal install on standard shower arms — one upgrade, every shower.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 11 12 4l8 7" />
        <path d="M6 10v9h12v-9" />
      </svg>
    ),
  },
  {
    title: 'Elevated Design',
    copy: 'Minimal hardware and premium finishes built for modern bathrooms.',
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="5" y="5" width="14" height="14" rx="1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
]

const REVIEWS = [
  {
    name: 'Sophia R.',
    date: 'Aug 2026',
    title: 'Noticeably softer water',
    body: 'Within a week my skin stopped feeling tight after showers. Pressure stayed strong and the hardware looks premium in our guest bath.',
  },
  {
    name: 'Marcus T.',
    date: 'Jul 2026',
    title: 'Install took five minutes',
    body: 'Twist-on setup was straightforward. Hair feels less brittle and the chlorine smell from our tap is gone.',
  },
  {
    name: 'Elena K.',
    date: 'Jul 2026',
    title: 'Worth the upgrade',
    body: 'I was skeptical about filtered showerheads. EVERYDAY keeps flow high while the water finally feels clean.',
  },
  {
    name: 'Jordan P.',
    date: 'Jun 2026',
    title: 'Great for hard water',
    body: 'Hard water was irritating my scalp. After a month the difference was clear — soap rinses cleaner and skin calmed down.',
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
    a: 'Autoship pairs your shower system with carbon filter refills on a Loop subscription — discounted today and on every future shipment. Pause or cancel anytime.',
  },
]

type PurchasePlan = 'bundle' | 'one'
type QtyOption = 'one' | 'multi'

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

function Stars({ value = 4.9 }: { value?: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      ★★★★★
    </span>
  )
}

function SectionHead({
  label,
  title,
  lead,
}: {
  label: string
  title: string
  lead?: string
}) {
  return (
    <div className="section-head">
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </div>
  )
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
  const [color, setColor] = useState<(typeof COLORS)[number]['id']>('chrome')
  const [qtyOption, setQtyOption] = useState<QtyOption>('multi')
  const [plan, setPlan] = useState<PurchasePlan>('bundle')
  const [qty, setQty] = useState(2)
  const [openFaq, setOpenFaq] = useState<number | null>(0)
  const [openInfo, setOpenInfo] = useState<string | null>('overview')
  const [added, setAdded] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  const unitPrice = useMemo(() => {
    if (plan === 'one') return 199
    return qtyOption === 'multi' || qty >= 2 ? 99 : 129
  }, [plan, qtyOption, qty])

  const lineTotal = unitPrice * (plan === 'one' ? 1 : Math.max(1, qty))
  const savings = plan === 'one' ? 0 : 199 * Math.max(1, qty) - lineTotal

  function selectColor(id: (typeof COLORS)[number]['id']) {
    setColor(id)
    const index = GALLERY.findIndex((g) =>
      id === 'black' ? g.src.includes('gallery-2') : g.src.includes('gallery-1'),
    )
    if (index >= 0) setSlide(index)
  }

  function addToCart() {
    setAdded(true)
    window.setTimeout(() => setAdded(false), 2200)
  }

  function joinList(event: React.FormEvent) {
    event.preventDefault()
    if (!email.trim()) return
    setEmailSent(true)
    setEmail('')
  }

  function shiftSlide(dir: -1 | 1) {
    setSlide((s) => (s + dir + GALLERY.length) % GALLERY.length)
  }

  return (
    <div className="site">
      <div className="announce">
        Free shipping on orders over $99 · Everybody. Everyday.
      </div>

      <header className="nav">
        <a className="nav-brand" href="#top" aria-label="EVERYDAY home">
          <LogoMark className="nav-mark" />
          <span>EVERYDAY</span>
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#buy">Shop</a>
          <a href="#features">Features</a>
          <a href="#science">Filtration</a>
          <a href="#reviews">Reviews</a>
          <a href="#faq">FAQ</a>
          <a href="#newsletter">Updates</a>
        </nav>
        <a className="btn btn-nav" href="#buy">
          Shop Now
        </a>
      </header>

      <main id="top">
        <section className="hero" aria-label="Introduction">
          <div className="hero-grid">
            <div className="hero-copy">
              <p className="hero-eyebrow">Everybody. Everyday.</p>
              <h1>
                Better Water.
                <br />
                Better Life.
              </h1>
              <p className="hero-lede">
                Premium filtered shower systems that remove chlorine and harsh
                contaminants — for cleaner water, healthier skin, and elevated
                everyday rituals.
              </p>
              <a className="btn btn-hero" href="#buy">
                Shop Now
              </a>
            </div>
            <div className="hero-media">
              <img
                src="/images/hero-showerhead.jpg"
                alt="EVERYDAY filtered shower system in a modern bathroom"
              />
            </div>
          </div>
        </section>

        <section className="features-strip" id="features">
          <div className="features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-card">
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pdp" id="buy" aria-label="Product">
          <div className="pdp-intro">
            <p className="eyebrow">Filtered Shower System</p>
            <h2 className="pdp-title">The everyday upgrade your water deserves.</h2>
          </div>

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
                <img
                  key={GALLERY[slide].src}
                  src={GALLERY[slide].src}
                  alt={GALLERY[slide].alt}
                />
                <button
                  type="button"
                  className="gallery-arrow next"
                  aria-label="Next image"
                  onClick={() => shiftSlide(1)}
                >
                  ›
                </button>
              </div>
              <div className="gallery-thumbs" role="tablist" aria-label="Product images">
                {GALLERY.map((image, index) => (
                  <button
                    key={image.src}
                    type="button"
                    role="tab"
                    aria-selected={slide === index}
                    className={slide === index ? 'is-active' : undefined}
                    onClick={() => setSlide(index)}
                  >
                    <img src={image.src} alt="" />
                  </button>
                ))}
              </div>
            </div>

            <div className="buybox">
              <div className="rating-row">
                <Stars />
                <span>4.9</span>
                <a href="#reviews">128 Reviews</a>
              </div>

              <p className="buybox-lede">
                A multi-stage filtered shower system that helps remove chlorine
                and harsh stuff from tap water — science-backed purity for your
                home.
              </p>

              <fieldset className="option-block">
                <legend>Finish</legend>
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
                    <div>
                      <strong>1 Showerhead</strong>
                      <span className="price-line">
                        <em>$129</em> each
                      </span>
                    </div>
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
                    <span className="value-badge">Best value</span>
                    <div>
                      <strong>2 Showerheads</strong>
                      <span className="price-line">
                        <em>$99</em> each · save $60
                      </span>
                    </div>
                  </button>
                </div>
              </fieldset>

              <fieldset className="option-block">
                <legend>Purchase option</legend>
                <div className="plan-options">
                  <button
                    type="button"
                    className={`choice-card plan-card ${plan === 'bundle' ? 'is-selected' : ''}`}
                    onClick={() => setPlan('bundle')}
                  >
                    <span className="value-badge value-badge--dark">Save 15%</span>
                    <div className="plan-top">
                      <strong>Autoship</strong>
                      <span>
                        <s>$199</s> <em>${unitPrice}</em>
                        {savings > 0 ? ` · save $${savings}` : null}
                      </span>
                    </div>
                    <ul>
                      <li>Shower system + carbon filter subscription</li>
                      <li>Replacement filters every 90 days ($29)</li>
                      <li>Pause or cancel anytime</li>
                    </ul>
                    <div className="filter-row">
                      <img src="/images/gallery-3.jpg" alt="" />
                      <div>
                        <p className="filter-label">Included with Autoship</p>
                        <strong>Carbon Showerhead Filters</strong>
                        <p>Every 90 days · Loop Subscribe &amp; Save</p>
                      </div>
                    </div>
                  </button>
                  <button
                    type="button"
                    className={`choice-card plan-card ${plan === 'one' ? 'is-selected' : ''}`}
                    onClick={() => setPlan('one')}
                  >
                    <div className="plan-top">
                      <strong>One-time purchase</strong>
                      <span>
                        <em>$199</em>
                      </span>
                    </div>
                    <p className="plan-note">Shower system only — add filters later</p>
                  </button>
                </div>
              </fieldset>

              {plan === 'bundle' ? (
                <div className="qty-stepper">
                  <span>Units</span>
                  <div className="stepper">
                    <button
                      type="button"
                      aria-label="Decrease quantity"
                      onClick={() =>
                        setQty((q) => {
                          const next = Math.max(1, q - 1)
                          setQtyOption(next >= 2 ? 'multi' : 'one')
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
                      onClick={() =>
                        setQty((q) => {
                          const next = q + 1
                          setQtyOption(next >= 2 ? 'multi' : 'one')
                          return next
                        })
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ) : null}

              <button type="button" className="btn btn-cart" onClick={addToCart}>
                {added
                  ? 'Added to cart'
                  : plan === 'bundle'
                    ? `Add Autoship — $${lineTotal}`
                    : `Add to cart — $${lineTotal}`}
              </button>

              <ul className="perk-list">
                <li>In stock · ships within 2 business days</li>
                <li>60-day money-back guarantee</li>
                <li>Pause or cancel Autoship anytime</li>
              </ul>

              <div className="info-accordions">
                {(
                  [
                    {
                      id: 'overview',
                      title: 'Overview',
                      body: (
                        <ul>
                          <li>Multi-stage filtration for everyday shower water</li>
                          <li>High-flow pressure with wide-face coverage</li>
                          <li>Universal quick install on standard shower arms</li>
                          <li>Designed for healthier skin, hair, and daily comfort</li>
                        </ul>
                      ),
                    },
                    {
                      id: 'design',
                      title: 'Design & performance',
                      body: (
                        <ul>
                          <li>Wide face · high-flow engineering</li>
                          <li>Replace filter every 90 days</li>
                          <li>KDF-55 + calcium sulfite multi-stage media</li>
                          <li>Targets chlorine and common shower contaminants</li>
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
                    onToggle={() =>
                      setOpenInfo((cur) => (cur === item.id ? null : item.id))
                    }
                  >
                    {item.body}
                  </Accordion>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section science" id="science">
          <SectionHead
            label="Tested & proven"
            title="Best-in-class filtration"
            lead="Third-party tested media engineered for real-world shower volumes."
          />
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

        <section className="section benefits" id="benefits">
          <SectionHead
            label="A healthier you"
            title="You’ll experience"
            lead="Cleaner water changes how your skin and hair feel — every single day."
          />
          <div className="benefit-grid">
            <article>
              <img src="/images/benefit-skin.jpg" alt="" />
              <h3>Clearer skin</h3>
              <p>Smoother, more hydrated skin with fewer breakouts and irritation.</p>
              <strong>93%</strong>
              <span>felt less dryness in 30 days</span>
            </article>
            <article>
              <img src="/images/benefit-hair.jpg" alt="" />
              <h3>Stronger hair</h3>
              <p>Protects natural moisture and color with less shedding and breakage.</p>
              <strong>94%</strong>
              <span>saw less hair shedding in 30 days</span>
            </article>
            <article>
              <img src="/images/benefit-pressure.jpg" alt="" />
              <h3>High-flow pressure</h3>
              <p>Powerful coverage without sacrificing filtration performance.</p>
              <strong>100%</strong>
              <span>reported a better shower experience</span>
            </article>
          </div>
          <p className="disclaimer">
            *Based on an external consumer perception study of 100 participants over
            30 days. Results may vary.
          </p>
        </section>

        <section className="section reviews" id="reviews">
          <SectionHead label="Testimonials" title="Real lives changed" />
          <div className="rating-row center">
            <Stars />
            <span>4.9 · 128 Reviews</span>
          </div>
          <div className="review-grid">
            {REVIEWS.map((review) => (
              <article key={review.name} className="review-card">
                <Stars />
                <h3>{review.title}</h3>
                <p>{review.body}</p>
                <footer>
                  <strong>{review.name}</strong>
                  <span>{review.date}</span>
                </footer>
              </article>
            ))}
          </div>
        </section>

        <section className="section problem" id="problem">
          <SectionHead
            label="The problem"
            title="Your water isn’t as clean as it looks"
          />
          <div className="problem-grid">
            <figure>
              <img
                src="/images/problem-pipe.jpg"
                alt="Corroded pipe interior showing scale and rust buildup"
              />
            </figure>
            <div>
              <p className="lede">
                Millions of homes rely on aging plumbing lined with rust, scale, and
                bacteria buildup — which is exactly why cleaner shower water matters
                for everyday health.
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

        <section className="section faq" id="faq">
          <SectionHead label="Support" title="Frequently asked" />
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
            <p className="eyebrow">Stay in the loop</p>
            <h2>Cleaner water updates, straight to your inbox.</h2>
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
                <button type="submit" className="btn btn-hero">
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </section>

        <section className="close-cta">
          <LogoMark className="close-mark" />
          <p className="close-eyebrow">Everybody. Everyday.</p>
          <h2>Ready for better water?</h2>
          <p>Premium filtration for clearer skin, stronger hair, and elevated everyday showers.</p>
          <button type="button" className="btn btn-hero" onClick={addToCart}>
            Shop Now
          </button>
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
    </div>
  )
}

export default App
