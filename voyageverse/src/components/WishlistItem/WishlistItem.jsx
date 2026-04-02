import { useState } from 'react'

export default function WishlistItem({ destination, imgUrl, onDelete, saved = 0, goal = 2000, onUpdateSaved }) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState(String(saved))
  const pct = Math.min(100, Math.round((saved / goal) * 100))

  function commitEdit() {
    const val = Math.max(0, Math.min(goal, Number(inputVal) || 0))
    onUpdateSaved?.(destination, val)
    setEditing(false)
  }

  return (
    <div className="relative w-full h-[240px] rounded-xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-2xl transition-shadow duration-300 flex flex-col">
      {/* Image with zoom on hover */}
      <img
        src={imgUrl}
        alt={destination}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

      {/* Delete button */}
      <button
        onClick={() => onDelete(destination)}
        className="absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110 z-10"
        style={{ background: 'rgba(239,68,68,0.85)', backdropFilter: 'blur(6px)' }}
        aria-label={`Delete ${destination}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      {/* Bottom content */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-3 z-10">
        {/* Destination name */}
        <h3
          className="text-white font-semibold text-base tracking-wide mb-2 capitalize"
          style={{ fontFamily: "'Poppins', sans-serif", textShadow: '0 1px 8px rgba(0,0,0,0.9)' }}
        >
          {destination}
        </h3>

        {/* Budget progress bar */}
        <div className="mb-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-white/50 text-[10px] uppercase tracking-widest" style={{ fontFamily: "'Inter', sans-serif" }}>
              Budget
            </span>
            {editing ? (
              <input
                autoFocus
                type="number"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onBlur={commitEdit}
                onKeyDown={e => e.key === 'Enter' && commitEdit()}
                className="w-16 text-[10px] text-yellow-400 bg-transparent border-b border-yellow-400/50 focus:outline-none text-right"
              />
            ) : (
              <button
                onClick={() => setEditing(true)}
                className="text-[10px] text-yellow-400/70 hover:text-yellow-400 transition-colors"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                ${saved.toLocaleString()} / ${goal.toLocaleString()}
              </button>
            )}
          </div>
          <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${pct}%`,
                background: pct >= 100
                  ? 'linear-gradient(to right, #22c55e, #16a34a)'
                  : 'linear-gradient(to right, #facc15, #f97316)',
              }}
            />
          </div>
          <p className="text-right text-[9px] text-white/30 mt-0.5" style={{ fontFamily: "'Inter', sans-serif" }}>
            {pct}% saved
          </p>
        </div>
      </div>
    </div>
  )
}
