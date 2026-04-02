import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { useAuth } from '../../context/AuthContext'

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { light } = useTheme()
  const { isSignedIn, signOut } = useAuth()

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleSignOut() {
    signOut()
    setDropdownOpen(false)
    navigate('/')
  }

  const navBg = light
    ? 'bg-gray-900/95 border-b border-gray-700'
    : 'bg-white/10 backdrop-blur-md border-b border-white/20'

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 text-white flex items-center justify-between pr-4 h-[60px] shadow-lg ${navBg}`}>
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 pl-3 group">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_14px_rgba(250,204,21,0.6)] group-hover:shadow-[0_0_22px_rgba(250,204,21,0.9)] transition-all duration-300 group-hover:scale-110">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <circle cx="12" cy="12" r="10" />
            <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <span className="text-xl font-extrabold tracking-wide text-white drop-shadow group-hover:text-yellow-300 transition-colors duration-200" style={{ fontFamily: "'Playfair Display', serif" }}>
          Voyage<span className="text-yellow-400">Verse</span>
        </span>
      </Link>

      {/* Nav links + auth */}
      <div className="flex items-center gap-1">
        <nav className="flex items-center gap-1 pr-2">
          {[
            { to: '/dashboard', label: 'Home' },
            { to: '/destinations', label: 'Destinations' },
            { to: '/gallery', label: 'Gallery' },
            { to: '/wishlist', label: 'Wishlist' },
            { to: '/review', label: 'Review' },
          ].map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className="relative px-4 py-1 text-sm font-semibold uppercase tracking-widest text-white/90 hover:text-white transition-colors duration-200 group"
            >
              {label}
              <span className="absolute bottom-0 left-0 h-[2px] w-0 bg-yellow-400 transition-all duration-300 group-hover:w-full rounded-full" />
            </Link>
          ))}
        </nav>

        {isSignedIn ? (
          <div className="relative ml-2" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(o => !o)}
              className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_10px_rgba(250,204,21,0.5)] hover:shadow-[0_0_18px_rgba(250,204,21,0.8)] hover:scale-110 transition-all duration-200 focus:outline-none"
              aria-label="Profile menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 top-12 w-48 bg-gray-900/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                <Link
                  to="/profile"
                  onClick={() => setDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
                  </svg>
                  View Profile
                </Link>
                <div className="border-t border-white/10" />
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white hover:bg-white/10 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1" />
                  </svg>
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <Link
              to="/signin"
              className="px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-white/80 hover:text-white border border-white/20 hover:border-white/50 rounded-full transition-all duration-200"
            >
              Sign In
            </Link>
            <Link
              to="/signin"
              className="px-4 py-1.5 text-sm font-semibold uppercase tracking-widest text-black bg-yellow-400 hover:bg-yellow-300 rounded-full transition-all duration-200 shadow-[0_0_10px_rgba(250,204,21,0.4)]"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
