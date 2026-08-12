import { useMemo, useState } from 'react'
import './App.css'

const GALLERY = [
  {
    src: '/images/gallery-1.jpg',
    alt: 'Drop Lab Ultimate Showerhead in polished chrome',
  },
  {
    src: '/images/gallery-2.jpg',
    alt: 'Drop Lab Ultimate Showerhead in matte black',
  },
  {
    src: '/images/gallery-3.jpg',
    alt: 'Drop Lab showerhead with replacement filter cartridge',
  },
  {
    src: '/images/product-detail.jpg',
    alt: 'Drop Lab showerhead spray face with fine mist',
  },
  {
    src: '/images/hero-showerhead.jpg',
    alt: 'Drop Lab showerhead installed in a bathroom',
  },
]

const COLORS = [
  { id: 'chrome', label: 'Polished Chrome', image: '/images/gallery-1.jpg' },
  { id: 'black', label: 'Matte Black', image: '/images/gallery-2.jpg' },
] as const

const REVIEWS = [
  {
    name: 'Sophia R.',
    date: 'Aug 2, 2026',
    title: 'Noticeably softer water',
    body: 'My skin stopped feeling tight after every shower within the first week. Pressure is still strong — better than my old head.',
  },
  {
    name: 'Marcus T.',
    date: 'Jul 28, 2026',
    title: 'Easy install, real difference',
    body: 'Twisted on in under five minutes. Hair feels less brittle and the chrome finish looks premium in our bathroom.',
  },
  {
    name: 'Elena K.',
    date: 'Jul 19, 2026',
    title: 'Worth the switch',
    body: 'I was skeptical about filtered showerheads. This one actually keeps flow high while cutting the chlorine smell.',
  },
  {
    name: 'Jordan P.',
    date: 'Jul 11, 2026',
    title: 'Great for hard water',
    body: 'We have very hard water. After a month my scalp irritation calmed down and soap rinses cleaner.',
  },
]

const FAQS = [
  {
    q: 'How often do I need to replace the filter?',
    a: 'Replace the cartridge every 90 days for optimal chlorine reduction and flow. Autoship can deliver filters on that cadence automatically.',
  },
  {
    q: 'Will the pressure be worse than my current showerhead?',
    a: 'No. The wide-face design is engineered for high flow while filtration runs in parallel — most customers report equal or better pressure.',
  },
  {
    q: 'Does the filter actually work?',
    a: 'Yes. The multi-stage media is tested for chlorine reduction across a 3-month lifespan, including extended high-volume water throughput.',
  },
  {
    q: 'Will it fit my shower?',
    a: 'It installs on standard shower arms with a few twists. Plumber’s tape and a fit wrench are included in the box.',
  },
]

type PurchasePlan = 'bundle' | 'one'
type QtyOption = 'one' | 'multi'

function Stars({ value = 4.9 }: { value?: number }) {
  return (
    <span className="stars" aria-label={`${value} out of 5 stars`}>
      {'★★★★★'}
    </span>
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

  const unitPrice = useMemo(() => {
    if (plan === 'one') return 199
    return qtyOption === 'multi' || qty >= 2 ? 99 : 129
  }, [plan, qtyOption, qty])

  const compareAt = plan === 'one' ? 199 : qtyOption === 'multi' || qty >= 2 ? 199 : 199
  const lineTotal = unitPrice * (plan === 'one' ? 1 : Math.max(1, qty))
  const savings =
    plan === 'one'
      ? 0
      : compareAt * Math.max(1, qty) - lineTotal

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

  function shiftSlide(dir: -1 | 1) {
    setSlide((s) => (s + dir + GALLERY.length) % GALLERY.length)
  }

  return (
    <div className="site">
      <div className="announce">Up to 50% off filtered showerheads</div>

      <header className="nav">
        <a className="nav-brand" href="#top">
          drop lab
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#buy">Filtered Showerhead</a>
          <a href="#benefits">Benefits</a>
          <a href="#science">Science</a>
          <a href="#faq">FAQ</a>
        </nav>
        <a className="nav-shop" href="#buy">
          Shop Now
        </a>
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
              <h1>Ultimate Showerhead</h1>
              <p className="buybox-lede">
                A premium multi-stage shower filter that removes chlorine and
                harmful toxins from your tap water — for healthier hair and skin.
              </p>

              <div className="rating-row">
                <Stars />
                <span>4.9</span>
                <a href="#reviews">128 Reviews</a>
              </div>

              <fieldset className="option-block">
                <legend>Select Color</legend>
                <div className="color-options">
                  {COLORS.map((c) => (
                    <label
                      key={c.id}
                      className={`color-option ${color === c.id ? 'is-selected' : ''}`}
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
                    className={`qty-card ${qtyOption === 'one' ? 'is-selected' : ''}`}
                    onClick={() => {
                      setQtyOption('one')
                      setQty(1)
                      setPlan('bundle')
                    }}
                  >
                    <div>
                      <strong>1 Showerhead</strong>
                      <span className="price-line">
                        <em>$129</em> Each
                      </span>
                    </div>
                    <span className="save-chip">SAVE $70</span>
                  </button>
                  <button
                    type="button"
                    className={`qty-card ${qtyOption === 'multi' ? 'is-selected' : ''}`}
                    onClick={() => {
                      setQtyOption('multi')
                      setQty((q) => Math.max(2, q))
                      setPlan('bundle')
                    }}
                  >
                    <div className="best-tag">50% OFF · BEST VALUE</div>
                    <div>
                      <strong>2+ Showerheads</strong>
                      <span className="price-line">
                        <em>$99</em> Each
                      </span>
                    </div>
                    <span className="save-chip">SAVE $200+</span>
                  </button>
                </div>
              </fieldset>

              <fieldset className="option-block">
                <legend className="sr-only">Purchase plan</legend>
                <div className="plan-options">
                  <button
                    type="button"
                    className={`plan-card ${plan === 'bundle' ? 'is-selected' : ''}`}
                    onClick={() => setPlan('bundle')}
                  >
                    <div className="popular-tag">MOST POPULAR OPTION</div>
                    <div className="plan-top">
                      <strong>Autoship</strong>
                      <span>
                        <s>$199</s> <em>${unitPrice}</em>
                        {savings > 0 ? ` SAVE $${savings}` : null}
                      </span>
                    </div>
                    <ul>
                      <li>Showerhead + filter + filter subscription</li>
                      <li>Replacement filter every 90 days ($39)</li>
                      <li>Pause or cancel anytime</li>
                    </ul>
                  </button>
                  <button
                    type="button"
                    className={`plan-card ${plan === 'one' ? 'is-selected' : ''}`}
                    onClick={() => setPlan('one')}
                  >
                    <div className="plan-top">
                      <strong>One-Time Purchase</strong>
                      <span>
                        <em>$199</em>
                      </span>
                    </div>
                  </button>
                </div>
              </fieldset>

              {plan === 'bundle' ? (
                <div className="qty-stepper">
                  <span>Quantity</span>
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

              <p className="fineprint">
                {plan === 'bundle' && qty >= 2
                  ? 'Save 50% on two or more. Price updates automatically in cart.'
                  : 'Price updates automatically in cart.'}
              </p>

              <button type="button" className="btn btn-cart" onClick={addToCart}>
                {added ? 'Added to cart' : `Add to cart — $${lineTotal}`}
              </button>

              <div className="trust-stack">
                <div className="stock-row">
                  <span className="in-stock">In stock</span>
                  <span>Ships by Aug 20, 2026</span>
                </div>
                <div className="urgency">
                  <div className="urgency-bar" style={{ width: '84%' }} />
                </div>
                <p className="urgency-copy">
                  84% of the current batch reserved · 37 reserved in the last 24
                  hours
                </p>
                <ul className="perk-list">
                  <li>Chlorine-tested filter</li>
                  <li>60-day money-back guarantee</li>
                  <li>HSA/FSA eligible</li>
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
                          <li>85% avg chlorine reduction over 3 months</li>
                          <li>High-flow water pressure with wide-face coverage</li>
                          <li>Universal quick install on standard shower arms</li>
                          <li>Larger filter cartridge for longer performance</li>
                        </ul>
                      ),
                    },
                    {
                      id: 'design',
                      title: 'Product Design & Performance',
                      body: (
                        <ul>
                          <li>7.4 in. face diameter · 2.5 GPM</li>
                          <li>Replace filter every 90 days</li>
                          <li>KDF-55 + calcium sulfite multi-stage media</li>
                          <li>Targets chlorine, heavy metals, and PFAS concerns</li>
                        </ul>
                      ),
                    },
                    {
                      id: 'included',
                      title: "What's Included",
                      body: (
                        <ul>
                          <li>Drop Lab Ultimate Showerhead</li>
                          <li>Pre-installed filter cartridge</li>
                          <li>Plumber’s tape + fit wrench</li>
                          <li>Optional flow restrictor + owner’s manual</li>
                        </ul>
                      ),
                    },
                  ] as const
                ).map((item) => (
                  <div key={item.id} className="accordion">
                    <button
                      type="button"
                      aria-expanded={openInfo === item.id}
                      onClick={() =>
                        setOpenInfo((cur) => (cur === item.id ? null : item.id))
                      }
                    >
                      {item.title}
                      <span aria-hidden="true">
                        {openInfo === item.id ? '−' : '+'}
                      </span>
                    </button>
                    {openInfo === item.id ? (
                      <div className="accordion-panel">{item.body}</div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="band endorsement">
          <div className="band-inner">
            <p className="pill">Lab tested</p>
            <h2>Built for people who treat the shower like recovery.</h2>
            <p>
              Drop Lab filters chlorine and common shower contaminants so skin
              and hair take less daily damage — without sacrificing pressure.
            </p>
          </div>
        </section>

        <section className="section reviews" id="reviews">
          <div className="section-head">
            <p className="pill">Testimonials</p>
            <h2>Real lives changed</h2>
            <div className="rating-row center">
              <Stars />
              <span>4.9 · 128 Reviews</span>
            </div>
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

        <section className="section benefits" id="benefits">
          <div className="section-head">
            <p className="pill">A healthier you</p>
            <h2>You’ll experience</h2>
          </div>
          <div className="benefit-grid">
            <article>
              <img src="/images/benefit-skin.jpg" alt="" />
              <h3>Clearer skin</h3>
              <p>
                Smoother, more hydrated skin with fewer breakouts, irritation,
                and flare-ups.
              </p>
              <strong>93%</strong>
              <span>felt less dryness in their face and skin in 30 days</span>
            </article>
            <article>
              <img src="/images/benefit-hair.jpg" alt="" />
              <h3>Stronger hair</h3>
              <p>
                Protects hair’s natural moisture and color with less shedding
                and breakage.
              </p>
              <strong>94%</strong>
              <span>saw less hair shedding and breaking in 30 days</span>
            </article>
            <article>
              <img src="/images/benefit-pressure.jpg" alt="" />
              <h3>High-flow pressure</h3>
              <p>
                Powerful water pressure without sacrificing filtration
                performance.
              </p>
              <strong>100%</strong>
              <span>reported a better shower experience every day</span>
            </article>
          </div>
          <p className="disclaimer">
            *Based on an external consumer perception study of 100 participants
            over 30 days. Results may vary.
          </p>
          <button type="button" className="btn btn-cart inline" onClick={addToCart}>
            Add to cart
          </button>
        </section>

        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {Array.from({ length: 2 }).map((_, loop) => (
              <p key={loop}>
                Smooth Skin · Less Acne · Fewer Flare-Ups · Less Tangled Hair ·
                Softer Hair · Smooth Skin · Less Acne · Fewer Flare-Ups · Less
                Tangled Hair · Softer Hair ·
              </p>
            ))}
          </div>
        </div>

        <section className="section problem" id="problem">
          <div className="section-head">
            <p className="pill">The problem</p>
            <h2>Your water isn’t safe</h2>
          </div>
          <div className="problem-grid">
            <figure>
              <img
                src="/images/problem-pipe.jpg"
                alt="Corroded pipe interior showing scale and rust buildup"
              />
            </figure>
            <div>
              <p className="lede">
                Millions of homes rely on decades-old plumbing lined with rust,
                scale, and bacteria buildup.
              </p>
              <ul className="stat-list">
                <li>
                  <strong>95%</strong>
                  <span>
                    of U.S. tested water sources surpassed safe thresholds for at
                    least one carcinogen
                  </span>
                </li>
                <li>
                  <strong>80%</strong>
                  <span>
                    of U.S. homes have detectable chlorine and heavy metals in
                    tap water
                  </span>
                </li>
                <li>
                  <strong>45%</strong>
                  <span>
                    of U.S. tap systems contain PFAS “forever chemicals”
                  </span>
                </li>
              </ul>
            </div>
          </div>

          <h3 className="cause-title">Unfiltered water causes</h3>
          <div className="cause-grid">
            <article>
              <h4>Skin breakouts</h4>
              <p>
                Chemicals from hard water clog pores and disrupt the skin barrier.
              </p>
            </article>
            <article>
              <h4>Weak & thinning hair</h4>
              <p>
                Minerals and chlorine dry the scalp and weaken hair at the root.
              </p>
            </article>
            <article>
              <h4>Dry, red, itchy skin</h4>
              <p>
                Chlorine strips natural oils, leaving skin dry and inflamed.
              </p>
            </article>
            <article>
              <h4>Brittle, dull hair</h4>
              <p>
                Chemical buildup removes moisture, causing breakage and dullness.
              </p>
            </article>
          </div>
        </section>

        <section className="section science" id="science">
          <div className="section-head">
            <p className="pill">Tested & proven</p>
            <h2>Best-in-class filtration</h2>
          </div>
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
              <strong>25%</strong>
              <p>larger filter than typical shower cartridges</p>
            </article>
            <article>
              <strong>250g+</strong>
              <p>calcium sulfite & KDF-55 filtration media</p>
            </article>
          </div>
          <button type="button" className="btn btn-cart inline" onClick={addToCart}>
            Add to cart
          </button>
        </section>

        <section className="section faq" id="faq">
          <div className="section-head">
            <p className="pill">Support</p>
            <h2>Frequently asked</h2>
          </div>
          <div className="faq-list">
            {FAQS.map((item, index) => (
              <div key={item.q} className="accordion">
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() =>
                    setOpenFaq((cur) => (cur === index ? null : index))
                  }
                >
                  {item.q}
                  <span aria-hidden="true">{openFaq === index ? '−' : '+'}</span>
                </button>
                {openFaq === index ? (
                  <div className="accordion-panel">
                    <p>{item.a}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>

        <section className="section close-cta">
          <h2>Start with cleaner water</h2>
          <p>Filtered shower water for clearer skin and stronger hair.</p>
          <button type="button" className="btn btn-cart" onClick={addToCart}>
            Add to cart
          </button>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">drop lab</p>
            <p>For people who do wellness differently.</p>
          </div>
          <div>
            <h3>Shop</h3>
            <a href="#buy">Filtered Showerhead</a>
            <a href="#buy">Replacement Filters</a>
          </div>
          <div>
            <h3>Support</h3>
            <a href="#faq">FAQ</a>
            <a href="#science">Science</a>
          </div>
          <div>
            <h3>Contact</h3>
            <a href="mailto:hello@droplab.example">hello@droplab.example</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
