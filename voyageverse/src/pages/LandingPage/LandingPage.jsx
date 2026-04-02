import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AOS from 'aos'
import 'aos/dist/aos.css'
import heroBg from '../../assets/hero-bg.avif'
import DestinationCard from '../../components/DestinationCard/DestinationCard'
import { fetchImages, chooseDestinations } from '../../services/unsplashService'

export default function LandingPage() {
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
    <div className="pt-[60px] min-h-screen relative">
      {/* Blurred dark background fixed behind everything */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center bg-fixed blur-sm scale-105 brightness-[0.35]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Hero Section */}
      <section className="relative w-full h-[500px] overflow-hidden">
        <img
          src={heroBg}
          alt="background"
          className="w-full h-full object-cover brightness-[0.6]"
        />
        <h1
          id="catchy-line"
          className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-white text-4xl font-bold text-center [text-shadow:2px_2px_8px_rgba(0,0,0,0.9)] w-full px-6 tracking-wide"
        >
          "The World is Yours to Explore — Start Today!"
        </h1>
        <div className="absolute top-[62%] left-1/2 -translate-x-1/2 flex gap-4">
          <Link
            to="/signin"
            className="px-7 py-2 rounded-full bg-white text-black font-semibold text-sm shadow-lg hover:bg-gray-100 hover:scale-105 transition-all duration-200"
          >
            Sign In
          </Link>
          <Link
            to="/signin"
            className="px-7 py-2 rounded-full bg-yellow-400 text-black font-semibold text-sm shadow-lg hover:bg-yellow-300 hover:scale-105 transition-all duration-200"
          >
            Sign Up
          </Link>
        </div>
      </section>

      {/* Popular Destinations */}
      <div className="destination-container px-6 py-10 text-center">
        <h2
          className="text-3xl font-bold mb-8 text-white drop-shadow tracking-wide"
          data-aos="fade-down"
        >
          Popular Destinations
        </h2>
        <div id="destinations" className="flex justify-center flex-row flex-wrap gap-5">
          {cards.map(({ destination, imgUrl }, index) =>
            imgUrl ? (
              <div
                key={destination}
                data-aos="fade-up"
                data-aos-delay={String((index % 4) * 100)}
              >
                <DestinationCard destination={destination} imgUrl={imgUrl} />
              </div>
            ) : null
          )}
        </div>
      </div>
    </div>
  )
}
