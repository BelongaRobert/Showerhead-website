import { useEffect, useRef, useState } from 'react'
import './App.css'

function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

function App() {
  const promise = useInView<HTMLElement>()
  const product = useInView<HTMLElement>()
  const ritual = useInView<HTMLElement>()
  const close = useInView<HTMLElement>()

  return (
    <div className="site">
      <header className="nav">
        <a className="nav-brand" href="#top" aria-label="Drop Lab home">
          Drop Lab
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#product">Product</a>
          <a href="#ritual">Ritual</a>
          <a className="nav-cta" href="#order">
            Shop
          </a>
        </nav>
      </header>

      <main id="top">
        <section className="hero" aria-label="Drop Lab hero">
          <div className="hero-media" aria-hidden="true">
            <img
              src="/images/hero-showerhead.jpg"
              alt=""
              className="hero-image"
            />
            <div className="hero-veil" />
          </div>

          <div className="hero-content">
            <p className="brand-mark">Drop Lab</p>
            <h1>Cleaner water. Clearer skin.</h1>
            <p className="hero-lede">
              A filtered showerhead tuned for daily skin and hair — quieter
              chemistry, fuller pressure, a calmer rinse.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#order">
                Shop the showerhead
              </a>
              <a className="btn btn-ghost" href="#product">
                See the build
              </a>
            </div>
          </div>
        </section>

        <section
          className={`section promise ${promise.visible ? 'is-in' : ''}`}
          ref={promise.ref}
        >
          <div className="section-inner">
            <p className="eyebrow">The Drop Lab idea</p>
            <h2>Your shower should leave less behind.</h2>
            <p className="lede">
              Chlorine and hard minerals wear on skin and hair every day. Drop
              Lab filters at the source so the water that hits you is softer,
              cleaner, and easier to live with — without a complicated install.
            </p>
          </div>
        </section>

        <section
          id="product"
          className={`section product ${product.visible ? 'is-in' : ''}`}
          ref={product.ref}
        >
          <div className="product-grid">
            <figure className="product-figure">
              <img
                src="/images/product-detail.jpg"
                alt="Drop Lab filtered showerhead with fine mist spray"
              />
            </figure>
            <div className="product-copy">
              <p className="eyebrow">The showerhead</p>
              <h2>Engineered for the rinse you feel.</h2>
              <p className="lede">
                Multi-stage filtration meets a high-flow face. Replace the
                cartridge every 60 days and keep the ritual consistent — chrome
                finish, wall-mount fit, no tools beyond plumber’s tape.
              </p>
              <ul className="spec-list">
                <li>Activated carbon + micro-filter stages</li>
                <li>Pressure-forward spray pattern</li>
                <li>60-day cartridge cadence</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          id="ritual"
          className={`section ritual ${ritual.visible ? 'is-in' : ''}`}
          ref={ritual.ref}
        >
          <div className="section-inner ritual-inner">
            <p className="eyebrow">The ritual</p>
            <h2>Three steps. Then forget the hardware.</h2>
            <ol className="steps">
              <li>
                <span className="step-index">01</span>
                <div>
                  <h3>Twist on</h3>
                  <p>Fits a standard shower arm. Seal with the included tape.</p>
                </div>
              </li>
              <li>
                <span className="step-index">02</span>
                <div>
                  <h3>Rinse in</h3>
                  <p>Let the filter settle into your morning and evening flow.</p>
                </div>
              </li>
              <li>
                <span className="step-index">03</span>
                <div>
                  <h3>Refresh</h3>
                  <p>Swap the cartridge on a 60-day rhythm. Keep pressure true.</p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <section
          id="order"
          className={`section close ${close.visible ? 'is-in' : ''}`}
          ref={close.ref}
        >
          <div className="close-panel">
            <p className="brand-mark close-brand">Drop Lab</p>
            <h2>Start with cleaner water.</h2>
            <p className="lede">
              Filtered showerheads and replacements — built for the bathroom you
              already have.
            </p>
            <a className="btn btn-primary" href="#order">
              Get Drop Lab
            </a>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p className="footer-brand">Drop Lab</p>
        <p className="footer-note">Filtered shower water for skin and hair.</p>
      </footer>
    </div>
  )
}

export default App
