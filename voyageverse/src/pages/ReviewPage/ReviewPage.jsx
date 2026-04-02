import { useState, useRef, useEffect } from 'react'
import wishlistBg from '../../assets/wishlist-bg.jpg'

const TRIP_TYPES = ['#SoloTraveler', '#FamilyTrip', '#Backpacker', '#LuxuryTravel', '#AdventureSeeker']

const STAR_LABELS = ['Rough Journey', 'It Was Okay', 'Good Experience', 'Amazing Trip', 'First Class Experience']

const AVATARS = ['🧳', '🌍', '✈️', '🗺️', '🏔️', '🏖️']

function ImageDropZone({ value, onChange }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = e => onChange(e.target.result)
    reader.readAsDataURL(file)
  }

  function onDrop(e) {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  return (
    <div>
      <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Upload your hero shot</p>
      {value ? (
        <div className="relative rounded-xl overflow-hidden h-36">
          <img src={value} alt="upload preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute top-2 right-2 h-6 w-6 flex items-center justify-center rounded-full text-white text-xs hover:bg-white/30 transition-all"
            style={{ background: 'rgba(0,0,0,0.5)' }}
          >✕</button>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`h-36 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 ${
            dragging ? 'scale-[1.02]' : ''
          }`}
          style={{
            border: `2px dashed ${dragging ? 'rgba(250,204,21,0.7)' : 'rgba(255,255,255,0.15)'}`,
            background: dragging ? 'rgba(250,204,21,0.06)' : 'rgba(255,255,255,0.03)',
          }}
        >
          <span className="text-3xl">📸</span>
          <p className="text-white/40 text-xs text-center">Drag & drop your photo here<br />or <span className="text-yellow-400 underline">browse</span></p>
          <input ref={inputRef} type="file" accept="image/*" className="hidden"
            onChange={e => handleFile(e.target.files[0])} />
        </div>
      )}
    </div>
  )
}

function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0)
  const active = hovered || value
  return (
    <div className="flex items-center gap-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            onMouseEnter={() => setHovered(n)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange(n)}
            className="text-2xl transition-all duration-200 hover:scale-125"
            style={{ filter: n <= active ? 'none' : 'grayscale(1) opacity(0.3)' }}
          >
            ✈️
          </button>
        ))}
      </div>
      {active > 0 && (
        <span className="text-yellow-400 text-xs font-semibold tracking-wide">
          {STAR_LABELS[active - 1]}
        </span>
      )}
    </div>
  )
}

function ReviewCard({ review, onEdit, onDelete }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}
    >
      {review.heroImage && (
        <div className="relative h-52 overflow-hidden">
          <img src={review.heroImage} alt="trip" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-3 left-4">
            <span className="text-white font-bold text-lg">{review.destination}</span>
          </div>
        </div>
      )}

      <div className="p-5 flex gap-4">
        <div className="shrink-0 h-12 w-12 rounded-full flex items-center justify-center text-2xl"
          style={{ background: 'rgba(250,204,21,0.15)', border: '1.5px solid rgba(250,204,21,0.3)' }}>
          {review.avatar}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-white font-bold text-sm">{review.name || 'Anonymous Explorer'}</span>
              <span className="text-xs px-2 py-0.5 rounded-full text-yellow-400 font-semibold"
                style={{ background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.25)' }}>
                ✓ Verified Traveler
              </span>
              {review.tripType && (
                <span className="text-xs px-2 py-0.5 rounded-full text-white/60"
                  style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                  {review.tripType}
                </span>
              )}
            </div>
            {/* Edit / Delete buttons */}
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(review)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-white/60 hover:text-yellow-400 transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => onDelete(review.id)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-white/60 hover:text-red-400 transition-all"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                🗑️ Delete
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(n => (
              <span key={n} className="text-sm" style={{ filter: n <= review.rating ? 'none' : 'grayscale(1) opacity(0.3)' }}>✈️</span>
            ))}
            {!review.heroImage && <span className="text-white/40 text-xs ml-1">· {review.destination}</span>}
            {review.date && <span className="text-white/30 text-xs">· {review.date}</span>}
          </div>

          <p className="text-white/70 text-sm leading-relaxed">{review.message}</p>
        </div>
      </div>
    </div>
  )
}

function EditModal({ review, onSave, onClose }) {
  const [draft, setDraft] = useState({ ...review })

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl p-6 flex flex-col gap-4"
        style={{ background: 'rgba(20,20,20,0.97)', border: '1px solid rgba(255,255,255,0.12)' }}
        onClick={e => e.stopPropagation()}>

        <div className="flex items-center justify-between">
          <h2 className="text-white font-bold text-lg">Edit Postcard</h2>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl transition-colors">✕</button>
        </div>

        <input type="text" placeholder="Your name"
          value={draft.name}
          onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
          className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/30 text-sm py-2 focus:outline-none focus:border-yellow-400 transition-colors"
        />
        <input type="text" placeholder="Destination"
          value={draft.destination}
          onChange={e => setDraft(p => ({ ...p, destination: e.target.value }))}
          className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/30 text-sm py-2 focus:outline-none focus:border-yellow-400 transition-colors"
        />
        <textarea placeholder="Your experience..."
          value={draft.message}
          onChange={e => setDraft(p => ({ ...p, message: e.target.value }))}
          rows={5}
          className="w-full bg-transparent border border-white/15 rounded-xl text-white/80 placeholder-white/25 text-sm p-3 resize-none focus:outline-none focus:border-yellow-400 transition-colors"
          style={{ fontFamily: "'Playfair Display', serif" }}
        />

        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Rating</p>
          <StarRating value={draft.rating} onChange={r => setDraft(p => ({ ...p, rating: r }))} />
        </div>

        <div className="flex gap-2 justify-end mt-2">
          <button onClick={onClose}
            className="px-5 py-2 rounded-full text-sm text-white/60 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)' }}>
            Cancel
          </button>
          <button onClick={() => onSave(draft)}
            className="px-5 py-2 rounded-full text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-all">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

function ReviewPage() {
  const [form, setForm] = useState({ name: '', destination: '', date: '', message: '', rating: 0, tripType: '', heroImage: null })
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [editingReview, setEditingReview] = useState(null)

  function handleDelete(id) {
    setReviews(prev => prev.filter(r => r.id !== id))
  }

  function handleSaveEdit(updated) {
    setReviews(prev => prev.map(r => r.id === updated.id ? updated : r))
    setEditingReview(null)
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!form.destination.trim() || !form.message.trim()) {
      setError('Please fill in the destination and your experience.')
      return
    }
    if (form.rating === 0) { setError('Please rate your experience.'); return }
    setError('')
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]
    setReviews(prev => [{ ...form, avatar, id: Date.now() }, ...prev])
    setForm({ name: '', destination: '', date: '', message: '', rating: 0, tripType: '', heroImage: null })
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen pt-[60px] bg-cover bg-center bg-fixed relative" style={{ backgroundImage: `url(${wishlistBg})` }}>
      <div className="absolute inset-0 bg-black/55" />
      {editingReview && (
        <EditModal review={editingReview} onSave={handleSaveEdit} onClose={() => setEditingReview(null)} />
      )}

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-14">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-yellow-400 uppercase tracking-[0.3em] text-xs font-semibold mb-3">✦ Traveler Stories</p>
          <h1 className="text-5xl font-extrabold text-white mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Share Your <span className="text-yellow-400">Journey</span>
          </h1>
          <p className="text-white/50 text-base italic" style={{ fontFamily: "'Playfair Display', serif" }}>
            Every trip tells a story — write yours on a postcard.
          </p>
        </div>

        {/* Postcard form */}
        <form onSubmit={handleSubmit} className="rounded-3xl overflow-hidden shadow-2xl mb-12"
          style={{ background: 'rgba(255,248,220,0.06)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,248,220,0.15)' }}>

          {/* Postcard top bar */}
          <div className="flex items-center justify-between px-6 py-3 border-b border-white/10"
            style={{ background: 'rgba(255,248,220,0.05)' }}>
            <span className="text-yellow-400/70 text-xs uppercase tracking-widest font-semibold">✉️ Postcard</span>
            <span className="text-white/30 text-xs">VoyageVerse · Est. 2024</span>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Left — fields */}
            <div className="flex-1 p-6 flex flex-col gap-4 border-b md:border-b-0 md:border-r border-white/10 border-dashed">
              <p className="text-white/40 text-xs uppercase tracking-widest">From the desk of...</p>

              {/* Name */}
              <input
                type="text" placeholder="Your name (optional)"
                value={form.name}
                onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/30 text-sm py-2 focus:outline-none focus:border-yellow-400 transition-colors"
              />

              {/* Destination */}
              <input
                type="text" placeholder="Destination visited *"
                value={form.destination}
                onChange={e => setForm(p => ({ ...p, destination: e.target.value }))}
                className="w-full bg-transparent border-b border-white/20 text-white placeholder-white/30 text-sm py-2 focus:outline-none focus:border-yellow-400 transition-colors"
              />

              {/* Date */}
              <input
                type="date"
                value={form.date}
                onChange={e => setForm(p => ({ ...p, date: e.target.value }))}
                className="w-full bg-transparent border-b border-white/20 text-white/70 text-sm py-2 focus:outline-none focus:border-yellow-400 transition-colors"
                style={{ colorScheme: 'dark' }}
              />

              {/* Trip type chips */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Trip type</p>
                <div className="flex flex-wrap gap-2">
                  {TRIP_TYPES.map(t => (
                    <button key={t} type="button"
                      onClick={() => setForm(p => ({ ...p, tripType: p.tripType === t ? '' : t }))}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        form.tripType === t ? 'bg-yellow-400 text-black' : 'text-white/60 hover:text-white'
                      }`}
                      style={form.tripType !== t ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' } : {}}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Star rating */}
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Rate your experience</p>
                <StarRating value={form.rating} onChange={r => setForm(p => ({ ...p, rating: r }))} />
              </div>

              {/* Image upload */}
              <ImageDropZone value={form.heroImage} onChange={v => setForm(p => ({ ...p, heroImage: v }))} />
            </div>

            {/* Right — message area (postcard back) */}
            <div className="flex-1 p-6 flex flex-col relative">
              {/* Stamp decoration */}
              <div className="absolute top-4 right-4 h-14 w-14 flex flex-col items-center justify-center rounded-sm text-center"
                style={{ border: '2px solid rgba(250,204,21,0.3)', background: 'rgba(250,204,21,0.05)' }}>
                <span className="text-xl">🌍</span>
                <span className="text-yellow-400/50 text-[8px] uppercase tracking-widest mt-0.5">Voyage</span>
              </div>

              <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Your message</p>
              <textarea
                placeholder="Dear fellow traveler, let me tell you about my journey..."
                value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                rows={8}
                className="flex-1 w-full bg-transparent text-white/80 placeholder-white/25 text-sm leading-relaxed resize-none focus:outline-none pr-16"
                style={{ fontFamily: "'Playfair Display', serif" }}
              />

              {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
              {submitted && <p className="text-green-400 text-xs mt-2">✓ Postcard sent! Your story is live below.</p>}

              <button type="submit"
                className="mt-4 self-start px-6 py-2.5 rounded-full text-sm font-bold text-black bg-yellow-400 hover:bg-yellow-300 hover:scale-105 transition-all shadow-[0_0_16px_rgba(250,204,21,0.4)]">
                Send Postcard ✉️
              </button>
            </div>
          </div>
        </form>

        {/* Reviews list */}
        {reviews.length > 0 && (
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest mb-5">
              {reviews.length} postcard{reviews.length > 1 ? 's' : ''} from fellow travelers
            </p>
            <div className="flex flex-col gap-4">
              {reviews.map(r => <ReviewCard key={r.id} review={r} onEdit={setEditingReview} onDelete={handleDelete} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReviewPage
