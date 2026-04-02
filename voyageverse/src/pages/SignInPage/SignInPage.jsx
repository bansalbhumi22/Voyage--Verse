import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import heroBg from '../../assets/hero-bg.avif'
import wishlistBg from '../../assets/wishlist-bg.jpg'
import { useAuth } from '../../context/AuthContext'

// Icon components
function EnvelopeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}
function LockIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  )
}
function UserIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  )
}

function InputField({ icon, type, placeholder, value, onChange }) {
  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 pointer-events-none">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-3 bg-transparent border-b border-white/20 text-white placeholder-white/35 focus:outline-none focus:border-yellow-400 transition-colors duration-300 text-sm"
      />
    </div>
  )
}

export default function SignInPage() {
  const [mode, setMode] = useState('signin')
  const navigate = useNavigate()
  const { signIn } = useAuth()

  const [signInData, setSignInData] = useState({ email: '', password: '' })
  const [signInError, setSignInError] = useState('')

  const [signUpData, setSignUpData] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [signUpSuccess, setSignUpSuccess] = useState(false)
  const [signUpError, setSignUpError] = useState('')

  function handleSignIn(e) {
    e.preventDefault()
    if (!signInData.email || !signInData.password) { setSignInError('Please fill in all fields.'); return }
    setSignInError('')
    signIn()
    navigate('/dashboard')
  }

  function handleSignUp(e) {
    e.preventDefault()
    const { firstName, lastName, email, password } = signUpData
    if (!firstName || !lastName || !email || !password) { setSignUpError('Please fill in all fields.'); return }
    setSignUpError('')
    setSignUpSuccess(true)
    setSignUpData({ firstName: '', lastName: '', email: '', password: '' })
    setTimeout(() => { setSignUpSuccess(false); setMode('signin') }, 1500)
  }

  return (
    <div className="min-h-screen flex pt-[60px] bg-black" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left panel: travel image ── */}
      <div
        className="hidden lg:flex flex-1 relative overflow-hidden"
        style={{ backgroundImage: `url(${wishlistBg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        {/* Vertically centered text */}
        <div className="relative z-10 flex flex-col justify-center px-14 text-white">
          <p className="text-yellow-400 uppercase tracking-[0.3em] text-xs font-semibold mb-4">Your journey starts here</p>
          <h2 className="text-5xl font-extrabold leading-tight mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>
            Explore the world,<br />
            <span className="text-yellow-400">one destination</span><br />
            at a time.
          </h2>
          <p className="text-white/60 text-base max-w-xs leading-relaxed">
            Save dream destinations, discover hidden gems, and share your travel stories with the world.
          </p>
        </div>
      </div>

      {/* ── Right panel: form ── */}
      <div className="flex-1 flex items-center justify-center relative px-6 py-10">
        {/* Blurred bg */}
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center blur-sm scale-105 brightness-[0.25]"
          style={{ backgroundImage: `url(${heroBg})` }}
        />

        <div className="w-full max-w-sm">

          {/* ── Pill toggle ── */}
          <div className="relative flex bg-white/10 rounded-full p-1 mb-8 border border-white/10">
            {/* Sliding highlight */}
            <div
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-yellow-400 transition-transform duration-300 ease-in-out ${
                mode === 'signup' ? 'translate-x-[calc(100%+8px)]' : 'translate-x-0'
              }`}
            />
            <button
              onClick={() => { setMode('signin'); setSignInError('') }}
              className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-colors duration-300 ${
                mode === 'signin' ? 'text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setMode('signup'); setSignUpError(''); setSignUpSuccess(false) }}
              className={`relative z-10 flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-full transition-colors duration-300 ${
                mode === 'signup' ? 'text-black' : 'text-white/60 hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* ── Glassmorphism card ── */}
          <div
            className="rounded-2xl border border-white/10 shadow-2xl px-8 py-10"
            style={{ background: 'rgba(30, 30, 30, 0.6)', backdropFilter: 'blur(15px)' }}
          >
            {/* Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="flex items-center justify-center h-13 w-13 h-12 w-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_18px_rgba(250,204,21,0.5)] mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold text-white tracking-wide" style={{ fontFamily: "'Playfair Display', serif" }}>
                Voyage<span className="text-yellow-400">Verse</span>
              </h1>
              <p
                className="text-white/50 mt-2 text-center leading-snug"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.95rem' }}
              >
                {mode === 'signin' ? 'Welcome back, explorer!' : 'Join the adventure today!'}
              </p>
            </div>

            {/* ── Sign In Form ── */}
            {mode === 'signin' && (
              <form onSubmit={handleSignIn} className="flex flex-col gap-6">
                <InputField
                  icon={<EnvelopeIcon />}
                  type="email"
                  placeholder="Email address"
                  value={signInData.email}
                  onChange={e => setSignInData(p => ({ ...p, email: e.target.value }))}
                />
                <InputField
                  icon={<LockIcon />}
                  type="password"
                  placeholder="Password"
                  value={signInData.password}
                  onChange={e => setSignInData(p => ({ ...p, password: e.target.value }))}
                />
                {signInError && <p className="text-red-400 text-xs -mt-2">{signInError}</p>}
                <button
                  type="submit"
                  className="w-full py-3 mt-2 rounded-full bg-yellow-400 text-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-300 hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  Sign In
                </button>
                <p className="text-center text-white/40 text-xs">
                  No account?{' '}
                  <button type="button" onClick={() => setMode('signup')} className="text-yellow-400 hover:underline font-semibold">
                    Sign Up
                  </button>
                </p>
              </form>
            )}

            {/* ── Sign Up Form ── */}
            {mode === 'signup' && (
              <form onSubmit={handleSignUp} className="flex flex-col gap-5">
                <div className="flex gap-4">
                  <InputField
                    icon={<UserIcon />}
                    type="text"
                    placeholder="First name"
                    value={signUpData.firstName}
                    onChange={e => setSignUpData(p => ({ ...p, firstName: e.target.value }))}
                  />
                  <InputField
                    icon={<UserIcon />}
                    type="text"
                    placeholder="Last name"
                    value={signUpData.lastName}
                    onChange={e => setSignUpData(p => ({ ...p, lastName: e.target.value }))}
                  />
                </div>
                <InputField
                  icon={<EnvelopeIcon />}
                  type="email"
                  placeholder="Email address"
                  value={signUpData.email}
                  onChange={e => setSignUpData(p => ({ ...p, email: e.target.value }))}
                />
                <InputField
                  icon={<LockIcon />}
                  type="password"
                  placeholder="Password"
                  value={signUpData.password}
                  onChange={e => setSignUpData(p => ({ ...p, password: e.target.value }))}
                />
                {signUpError && <p className="text-red-400 text-xs -mt-2">{signUpError}</p>}
                {signUpSuccess && <p className="text-green-400 text-xs -mt-2">Account created! Redirecting...</p>}
                <button
                  type="submit"
                  className="w-full py-3 mt-1 rounded-full bg-yellow-400 text-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-300 hover:scale-[1.02] transition-all duration-200 shadow-lg"
                >
                  Create Account
                </button>
                <p className="text-center text-white/40 text-xs">
                  Already have an account?{' '}
                  <button type="button" onClick={() => setMode('signin')} className="text-yellow-400 hover:underline font-semibold">
                    Sign In
                  </button>
                </p>
              </form>
            )}
          </div>

          <p className="text-center text-white/25 text-xs mt-6">
            <Link to="/" className="hover:text-white/50 transition-colors">← Back to Home</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
