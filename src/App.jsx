import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

const BEAR_FRAMES = Array.from(
  { length: 10 },
  (_, index) => `/hero-bear-frames/bear-${index + 1}.png`,
)

function Header({ isOpen, onToggle }) {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Bike Bear home">
        <img src="/logo.gif" alt="" />
      </a>

      <button
        className={`menu-button${isOpen ? ' is-open' : ''}`}
        type="button"
        aria-expanded={isOpen}
        aria-controls="menu-panel"
        onClick={onToggle}
      >
        <span className="menu-lines" aria-hidden="true"><i /><i /></span>
        <span className="hand-wrap" aria-hidden="true">
          <img
            src="/menu-hand.webp"
            alt=""
          />
        </span>
        <span className="sr-only">{isOpen ? 'Close menu' : 'Open menu'}</span>
      </button>
    </header>
  )
}

function Menu({ isOpen, onClose }) {
  return (
    <motion.aside
      id="menu-panel"
      className={`menu-panel${isOpen ? ' is-open' : ''}`}
      initial={false}
      animate={{ clipPath: isOpen ? 'circle(150% at 94% 7%)' : 'circle(0% at 94% 7%)' }}
      transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
      aria-hidden={!isOpen}
    >
      <nav aria-label="Primary navigation">
        {['Home', 'Work', 'About', 'Contact'].map((item, index) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            tabIndex={isOpen ? 0 : -1}
            onClick={onClose}
            initial={false}
            animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : 30 }}
            transition={{ delay: isOpen ? 0.16 + index * 0.05 : 0 }}
          >
            <span>0{index + 1}</span>{item}
          </motion.a>
        ))}
      </nav>
    </motion.aside>
  )
}

function Marquee() {
  const phrase = (
    <span>
      WE ARE A <strong>“BEARY”</strong> CREATIVE DIGITAL AGENCY FOR HOOMANS
      <b aria-hidden="true">✳</b>
    </span>
  )

  return (
    <div className="marquee" aria-label="We are a beary creative digital agency for humans">
      <div className="marquee-track">{phrase}{phrase}{phrase}{phrase}</div>
    </div>
  )
}

function App() {
  const rootRef = useRef(null)
  const heroRef = useRef(null)
  const wordsRef = useRef(null)
  const bearRef = useRef(null)
  const starRef = useRef(null)
  const eyebrowRef = useRef(null)
  const [bearFrame, setBearFrame] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    BEAR_FRAMES.forEach((src) => {
      const image = new Image()
      image.src = src
    })

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      lerp: reduceMotion ? 1 : 0.075,
      smoothWheel: !reduceMotion,
      syncTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)
    const updateLenis = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    const context = gsap.context(() => {
      if (reduceMotion) {
        setBearFrame(0)
        return
      }

      const frameState = { value: 0 }
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=4200',
          scrub: 0.65,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      timeline
        .to(wordsRef.current, { x: () => -Math.max(window.innerWidth * 0.54, 650), duration: 5 }, 0)
        .to(eyebrowRef.current, { x: -80, opacity: 0, duration: 1.5 }, 0)
        .to(bearRef.current, {
          x: () => -Math.min(window.innerWidth * 0.28, 440),
          y: () => Math.min(window.innerHeight * 0.035, 30),
          scale: 0.88,
          duration: 5.7,
        }, 0.15)
        .to(frameState, {
          value: BEAR_FRAMES.length - 1,
          duration: 5.7,
          snap: 'value',
          onUpdate: () => setBearFrame(Math.round(frameState.value)),
        }, 0.15)
        .fromTo(starRef.current, { scale: 0, rotation: -80 }, {
          scale: 0.17,
          rotation: 50,
          duration: 2,
        }, 2.8)
        .to(starRef.current, {
          scale: () => Math.max(window.innerWidth, window.innerHeight) / 37,
          rotation: 170,
          duration: 4,
        }, 5)
    }, rootRef)

    ScrollTrigger.refresh()

    return () => {
      context.revert()
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <div className="experience" ref={rootRef} id="top">
      <Header isOpen={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
      <Menu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <section className="hero-scene" ref={heroRef} aria-label="Bike Bear introduction">
          <div className="black-underlay" aria-hidden="true" />
          <div className="yellow-stage">
            <div className="eyebrow" ref={eyebrowRef}>WE ARE BIKE BEAR</div>

            <div className="hero-words" ref={wordsRef} aria-label="Dare to do">
              <span>DARE TO</span><span>DARE TO</span><span>DO</span>
            </div>

            <div className="bear-wrap" ref={bearRef}>
              <img
                src={BEAR_FRAMES[bearFrame]}
                alt="A black 3D bear mascot striking a pose"
                draggable="false"
              />
            </div>

            <svg className="reveal-star" ref={starRef} viewBox="0 0 100 100" aria-hidden="true">
              <path d="M50 0 58 7 69 4 74 14 85 15 86 27 96 32 92 43 100 50 92 58 96 69 85 74 84 85 73 86 68 96 57 92 50 100 42 92 31 96 26 85 15 84 14 73 4 68 8 57 0 50 8 42 4 31 15 26 16 15 27 14 32 4 43 8Z" />
            </svg>
          </div>

          <Marquee />
        </section>

        <section className="future-section" id="work" aria-label="Future content section" />
      </main>
    </div>
  )
}

export default App
