import { Link } from 'react-router-dom'
import heroBg from '../../assets/hero-bg.avif'

export default function ProfilePage() {
  return (
    <div className="min-h-screen relative bg-black flex items-center justify-center pt-[60px]">
      {/* Blurred background */}
      <div
        className="fixed inset-0 -z-10 bg-cover bg-center blur-sm scale-105 brightness-[0.3]"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      <div className="w-full max-w-sm mx-4">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl text-white text-center">
          {/* Avatar */}
          <div className="flex items-center justify-center mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-[0_0_20px_rgba(250,204,21,0.6)]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z" />
            </svg>
          </div>

          <h1 className="text-2xl font-extrabold mb-1">
            Voyage<span className="text-yellow-400">Verse</span> Explorer
          </h1>
          <p className="text-white/50 text-sm mb-6">traveler@voyageverse.com</p>

          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div className="bg-white/10 rounded-xl py-3">
              <p className="text-yellow-400 text-xl font-bold">12</p>
              <p className="text-white/60 text-xs mt-1">Wishlist</p>
            </div>
            <div className="bg-white/10 rounded-xl py-3">
              <p className="text-yellow-400 text-xl font-bold">5</p>
              <p className="text-white/60 text-xs mt-1">Reviews</p>
            </div>
            <div className="bg-white/10 rounded-xl py-3">
              <p className="text-yellow-400 text-xl font-bold">7</p>
              <p className="text-white/60 text-xs mt-1">Explored</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/wishlist"
              className="w-full py-2.5 rounded-lg bg-yellow-400 text-black font-bold uppercase tracking-widest text-sm hover:bg-yellow-300 hover:scale-[1.02] transition-all duration-200"
            >
              My Wishlist
            </Link>
            <Link
              to="/review"
              className="w-full py-2.5 rounded-lg bg-white/10 border border-white/20 text-white font-semibold uppercase tracking-widest text-sm hover:bg-white/20 transition-all duration-200"
            >
              Write a Review
            </Link>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          <Link to="/dashboard" className="hover:text-white/60 transition-colors">← Back to Dashboard</Link>
        </p>
      </div>
    </div>
  )
}
