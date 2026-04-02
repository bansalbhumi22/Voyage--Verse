import { useState, useEffect, useRef } from 'react'
import { fetchImage } from '../../services/unsplashService.js'
import WishlistItem from '../../components/WishlistItem/WishlistItem.jsx'
import worldMap from '../../assets/world-map.png'
import { useTheme } from '../../context/ThemeContext'

const BUDGET_KEY = '__vv_budgets__'

function loadBudgets() {
  try { return JSON.parse(localStorage.getItem(BUDGET_KEY)) || {} } catch { return {} }
}

function WishlistPage() {
  const [items, setItems] = useState([])
  const [budgets, setBudgets] = useState(loadBudgets)
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef(null)
  const { light, setLight } = useTheme()

  useEffect(() => {
    const loaded = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key === 'loggedInUserId' || key === BUDGET_KEY || key === 'vv_signed_in') continue
      try {
        const imgUrl = JSON.parse(localStorage.getItem(key))
        if (imgUrl) loaded.push({ destination: key, imgUrl })
      } catch { /* skip */ }
    }
    setItems(loaded)
  }, [])

  async function handleSearch() {
    const term = query.trim()
    if (!term) return
    setLoading(true)
    const imgUrl = await fetchImage(term)
    setLoading(false)
    if (imgUrl) {
      localStorage.setItem(term, JSON.stringify(imgUrl))
      setItems(prev => [...prev, { destination: term, imgUrl }])
      setQuery('')
    }
  }

  function handleKeyDown(e) { if (e.key === 'Enter') handleSearch() }

  function handleDelete(destination) {
    localStorage.removeItem(destination)
    setItems(prev => prev.filter(i => i.destination !== destination))
  }

  function handleUpdateSaved(destination, val) {
    const next = { ...budgets, [destination]: { ...budgets[destination], saved: val } }
    setBudgets(next)
    localStorage.setItem(BUDGET_KEY, JSON.stringify(next))
  }

  function handleShare() {
    const url = window.location.href
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Theme tokens
  const bg = light
    ? 'bg-gradient-to-br from-amber-50 to-orange-100'
    : ''
  const titleColor = light ? 'text-gray-900' : 'text-white'
  const subColor = light ? 'text-gray-500' : 'text-white/60'
  const cardBg = light ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.06)'
  const cardBorder = light ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.12)'

  return (
    <div className={`min-h-screen pt-[60px] relative ${bg}`}>
      {/* Background — only in dark mode */}
      {!light && <>
        <div
          className="fixed inset-0 -z-20 bg-cover bg-center scale-110 blur-md brightness-50"
          style={{ backgroundImage: `url(https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80)` }}
        />
        <div className="fixed inset-0 -z-10"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.6) 100%)' }}
        />
        <div
          className="fixed inset-0 -z-10 bg-center bg-no-repeat bg-contain pointer-events-none"
          style={{ backgroundImage: `url(${worldMap})`, opacity: 0.04 }}
        />
      </>}

      {/* ── Header ── */}
      <div className="flex flex-col items-center pt-16 pb-8 px-4 text-center">

        {/* Dark/Light toggle + Share — top row */}
        <div className="flex items-center gap-3 mb-8">
          {/* Sunrise/Sunset toggle */}
          <button
            onClick={() => setLight(l => !l)}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
            style={{
              background: light ? 'rgba(251,191,36,0.2)' : 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${light ? 'rgba(251,191,36,0.5)' : 'rgba(255,255,255,0.15)'}`,
              color: light ? '#92400e' : 'rgba(255,255,255,0.7)',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            <span>{light ? '🌅' : '🌙'}</span>
            <span>{light ? 'Sunrise' : 'Sunset'}</span>
          </button>

          {/* Share button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-widest transition-all duration-300"
            style={{
              background: copied ? 'rgba(34,197,94,0.2)' : 'rgba(250,204,21,0.15)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${copied ? 'rgba(34,197,94,0.4)' : 'rgba(250,204,21,0.35)'}`,
              color: copied ? '#16a34a' : '#facc15',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {copied ? (
              <><span>✓</span><span>Copied!</span></>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>Share Wishlist</span>
              </>
            )}
          </button>
        </div>

        <h1
          className={`text-5xl md:text-6xl font-extrabold mb-3 ${titleColor}`}
          style={{ fontFamily: "'Poppins', sans-serif", textShadow: light ? 'none' : '0 2px 16px rgba(0,0,0,0.8)' }}
        >
          My Travel <span className="text-yellow-400">Wishlist</span>
        </h1>
        <p
          className={`text-base font-light tracking-[0.2em] mb-8 ${subColor}`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          A glimpse of the places my heart wants to explore
        </p>

        {/* Search bar */}
        <div
          className="flex items-center w-full max-w-lg rounded-full gap-3"
          style={{
            background: light ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(14px)',
            border: '1px solid rgba(250,204,21,0.35)',
            padding: '14px 24px',
            boxShadow: light ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" style={{ color: light ? '#9ca3af' : 'rgba(255,255,255,0.4)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            id="search-bar"
            placeholder="Search for a destination..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent text-sm focus:outline-none"
            style={{ fontFamily: "'Inter', sans-serif", color: light ? '#1f2937' : 'white' }}
          />
          <button
            id="search-btn"
            onClick={handleSearch}
            disabled={loading}
            className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 shadow-[0_0_12px_rgba(250,204,21,0.5)]"
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
      </div>

      {/* ── Grid ── */}
      <div className="px-6 pb-20">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-6 mt-2">
            <p className="text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'Inter', sans-serif", color: light ? '#9ca3af' : 'rgba(255,255,255,0.4)' }}>
              Your wishlist is empty — start exploring!
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 w-full max-w-4xl mx-auto">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="relative h-[200px] rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer group transition-all duration-300"
                  style={{ background: cardBg, backdropFilter: 'blur(16px)', border: `1px solid ${cardBorder}` }}
                  onClick={() => inputRef.current?.focus()}
                >
                  <div
                    className="flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(250,204,21,0.1)', border: '1.5px solid rgba(250,204,21,0.3)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400/60 group-hover:text-yellow-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <span className="text-xs tracking-widest uppercase transition-colors duration-300" style={{ fontFamily: "'Inter', sans-serif", color: light ? '#9ca3af' : 'rgba(255,255,255,0.3)' }}>
                    Add adventure
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items.map(({ destination, imgUrl }) => (
              <WishlistItem
                key={destination}
                destination={destination}
                imgUrl={imgUrl}
                onDelete={handleDelete}
                saved={budgets[destination]?.saved ?? 0}
                goal={budgets[destination]?.goal ?? 2000}
                onUpdateSaved={handleUpdateSaved}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
