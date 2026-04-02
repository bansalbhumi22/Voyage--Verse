import { useState, useEffect, useRef } from 'react'
import { destinations } from '../../data/destinations.js'
import { fetchImage } from '../../services/unsplashService.js'

const destKeys = Object.keys(destinations)

// Shimmer skeleton card
function Shimmer() {
  return (
    <div className="rounded-2xl p-5 animate-pulse" style={{ background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)' }}>
      <div className="h-4 w-1/3 rounded bg-white/20 mb-3" />
      <div className="h-3 w-full rounded bg-white/10 mb-2" />
      <div className="h-3 w-5/6 rounded bg-white/10 mb-2" />
      <div className="h-3 w-4/6 rounded bg-white/10" />
    </div>
  )
}

const cardStyle = { background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }

export default function DestinationDetailsPage() {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [currentDestination, setCurrentDestination] = useState('Italy')
  const [imgUrl, setImgUrl] = useState(null)
  const [details, setDetails] = useState(destinations['Italy'])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    fetchImage('Italy').then(url => { setImgUrl(url); setLoading(false) })
  }, [])

  function handleQueryChange(e) {
    const val = e.target.value
    setQuery(val)
    setNotFound(false)
    if (val.trim().length > 0) {
      setSuggestions(destKeys.filter(k => k.toLowerCase().startsWith(val.toLowerCase())))
    } else {
      setSuggestions([])
    }
  }

  async function loadDestination(term) {
    const found = destinations[term]
    if (!found) { setNotFound(true); return }
    setLoading(true)
    setNotFound(false)
    setSuggestions([])
    setQuery('')
    const url = await fetchImage(term)
    setImgUrl(url)
    setCurrentDestination(term)
    setDetails(found)
    setLoading(false)
  }

  async function handleSearch() {
    const term = query.trim()
    if (!term) return
    // case-insensitive match
    const match = destKeys.find(k => k.toLowerCase() === term.toLowerCase())
    if (match) { loadDestination(match) } else { setNotFound(true); setSuggestions([]) }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') handleSearch()
    if (e.key === 'Escape') setSuggestions([])
  }

  return (
    <div className="min-h-screen pt-[60px] relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Blurred hero background */}
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center scale-110 transition-all duration-700"
        style={{ backgroundImage: imgUrl ? `url(${imgUrl})` : 'none', filter: 'blur(8px) brightness(0.35)' }}
      />
      <div className="fixed inset-0 -z-10" style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.7) 100%)' }} />

      {/* ── Hero section ── */}
      <section className="relative w-full h-[420px] overflow-hidden">
        {imgUrl && (
          <img
            src={imgUrl}
            alt={currentDestination}
            className="w-full h-full object-cover transition-all duration-700"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

        {/* Search bar — centered in hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 gap-4">
          <p className="text-yellow-400 uppercase tracking-[0.3em] text-xs font-semibold">✈️ Explore the World</p>
          <h1 className="text-5xl font-extrabold text-white drop-shadow-lg text-center capitalize">
            {currentDestination}
          </h1>
          <p className="text-white/70 text-lg italic">Uncover the magic of {currentDestination}</p>

          {/* Search */}
          <div className="relative w-full max-w-md mt-2">
            <div
              className="flex items-center rounded-full px-5 py-3 gap-3"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(14px)', border: '1px solid rgba(250,204,21,0.4)' }}
            >
              <input
                ref={inputRef}
                type="text"
                placeholder="Search a destination..."
                value={query}
                onChange={handleQueryChange}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-white placeholder-white/50 text-sm focus:outline-none"
              />
              <button
                onClick={handleSearch}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-all shadow-[0_0_12px_rgba(250,204,21,0.5)]"
                aria-label="Search"
              >
                {loading ? (
                  <svg className="animate-spin h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Auto-suggest dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 rounded-xl overflow-hidden shadow-2xl z-50" style={{ background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {suggestions.map(s => (
                  <button
                    key={s}
                    onClick={() => loadDestination(s)}
                    className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-yellow-400 transition-colors text-left"
                  >
                    <span className="text-yellow-400/60">📍</span> {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Not found state ── */}
      {notFound && (
        <div className="mx-6 mt-8 rounded-2xl p-6 text-center" style={cardStyle}>
          <p className="text-white/70 text-lg mb-2">🗺️ Destination not found in our database.</p>
          <p className="text-white/40 text-sm mb-4">Try one of our featured destinations:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {destKeys.map(k => (
              <button key={k} onClick={() => loadDestination(k)}
                className="px-4 py-1.5 rounded-full text-sm text-yellow-400 border border-yellow-400/30 hover:bg-yellow-400/10 transition-colors">
                {k}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Details grid ── */}
      {!notFound && (
        <div className="px-6 py-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[...Array(4)].map((_, i) => <Shimmer key={i} />)}
            </div>
          ) : details && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* About */}
              <div className="rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200" style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🌍</span>
                  <h2 className="text-white font-bold text-base uppercase tracking-widest">About</h2>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{details.about}</p>
              </div>

              {/* Attractions */}
              <div className="rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200" style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">📍</span>
                  <h2 className="text-white font-bold text-base uppercase tracking-widest">Top Attractions</h2>
                </div>
                <ul className="space-y-2">
                  {details.attractions.map(a => (
                    <li key={a} className="flex items-center gap-2 text-white/70 text-sm">
                      <span className="h-1.5 w-1.5 rounded-full bg-yellow-400 shrink-0" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weather */}
              <div className="rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200" style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🌤️</span>
                  <h2 className="text-white font-bold text-base uppercase tracking-widest">Weather</h2>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{details.weather}</p>
              </div>

              {/* Best Time to Visit */}
              <div className="rounded-2xl p-5 hover:-translate-y-1 transition-transform duration-200" style={cardStyle}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">🗓️</span>
                  <h2 className="text-white font-bold text-base uppercase tracking-widest">Best Time</h2>
                </div>
                <p className="text-white/70 text-sm leading-relaxed">{details.bestTime}</p>
              </div>
            </div>
          )}

          {/* Review quote */}
          {!loading && details && (
            <div className="mt-5 rounded-2xl p-5" style={cardStyle}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">💬</span>
                <h2 className="text-white font-bold text-base uppercase tracking-widest">Traveler Review</h2>
              </div>
              <p className="text-white/60 text-sm italic leading-relaxed">
                "Visiting {currentDestination} was a dream come true! The culture, the food, the people — absolutely unforgettable."
              </p>
              <p className="text-yellow-400/60 text-xs mt-2">— VoyageVerse Explorer</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
