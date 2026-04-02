import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import heroBg from '../../assets/hero-bg.avif'
import DestinationCard from '../../components/DestinationCard/DestinationCard'
import { fetchImages, chooseDestinations } from '../../services/unsplashService'

export default function Dashboard() {
  const [cards, setCards] = useState([])

  useEffect(() => {
    AOS.init({ duration: 700, once: false, easing: 'ease-in-out' })
  }, [])

  useEffect(() => {
    async function loadCards() {
      const results = await fetchImages(chooseDestinations())
      setCards(results)
      AOS.refresh()
    }
    loadCards()
    const interval = setInterval(loadCards, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="pt-[60px] min-h-screen relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Blurred dark background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed blur-sm scale-105 brightness-[0.3]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* ── Hero Section ── */}
      <section className="relative w-full h-[560px] overflow-hidden">
        <img
          src={heroBg}
          alt="hero background"
          className="w-full h-full object-cover brightness-[0.55]"
        />
        {/* Gradient fade at bottom */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="text-yellow-400 uppercase tracking-[0.3em] text-xs font-semibold mb-3">
            ✈️ Your adventure awaits
          </p>
          <h1
            className="text-5xl md:text-6xl font-extrabold text-white leading-tight mb-4 drop-shadow-lg"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            The World is Yours<br />
            <span className="text-yellow-400">to Explore</span>
          </h1>
          <p className="text-white/70 text-lg mb-8 max-w-md">
            Discover breathtaking destinations and start planning your next journey today.
          </p>
          <Link
            to="/wishlist"
            className="px-8 py-3 rounded-full text-white font-semibold text-sm tracking-wide border border-white/30 hover:border-yellow-400 hover:text-yellow-400 transition-all duration-300"
            style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)' }}
          >
            ✨ Create Your Wishlist
          </Link>
        </div>
      </section>

      {/* ── Welcome Section (borderless, spacious) ── */}
      <section className="max-w-4xl mx-auto px-8 py-14 text-white text-center" data-aos="fade-up">
        <h2
          className="text-4xl font-bold mb-4"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Welcome to <span className="text-yellow-400">VoyageVerse</span>
        </h2>
        <p className="text-white/60 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Hey explorer! Planning your next big trip? You're in the right place — we help you discover, plan, and share amazing travel experiences.
        </p>

        {/* Feature bullets with icons */}
        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-10">
          {[
            { icon: '✈️', text: 'Share your Experiences' },
            { icon: '📍', text: 'Discover Amazing Destinations' },
            { icon: '❤️', text: 'Create your Travel Wishlist' },
          ].map(({ icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-white/80 text-sm font-medium">
              <span className="text-xl">{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4">
          <Link
            to="/wishlist"
            className="px-7 py-2.5 rounded-full bg-yellow-400 text-black font-bold text-sm uppercase tracking-widest hover:bg-yellow-300 hover:scale-105 transition-all duration-200 shadow-lg"
          >
            My Wishlist
          </Link>
          <Link
            to="/destinations"
            className="px-7 py-2.5 rounded-full border border-white/30 text-white font-semibold text-sm uppercase tracking-widest hover:border-yellow-400 hover:text-yellow-400 transition-all duration-200"
          >
            Explore
          </Link>
        </div>
      </section>

      {/* ── Popular Destinations ── */}
      <section className="px-6 pb-16">
        <h2
          className="text-3xl font-bold text-white text-center mb-8 drop-shadow"
          data-aos="fade-down"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Popular Destinations
        </h2>

        {/* Responsive grid — 4 cols desktop, 2 tablet, horizontal scroll mobile */}
        <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map(({ destination, imgUrl }, index) =>
            imgUrl ? (
              <div key={destination} data-aos="fade-up" data-aos-delay={String((index % 4) * 80)}>
                <DestinationCard destination={destination} imgUrl={imgUrl} />
              </div>
            ) : null
          )}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex sm:hidden gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-hide">
          {cards.map(({ destination, imgUrl }) =>
            imgUrl ? (
              <div key={destination} className="snap-start shrink-0 w-[260px]">
                <DestinationCard destination={destination} imgUrl={imgUrl} />
              </div>
            ) : null
          )}
        </div>
      </section>
    </div>
  )
}
