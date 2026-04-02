import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { galleryCategories, destinations } from '../../data/destinations.js';
import { fetchImage } from '../../services/unsplashService.js';

const CATEGORY_DESTINATIONS = {
  'Snowy Escapes':          ['Norway', 'Canada', 'Switzerland', 'Germany'],
  'Secluded Shores':        ['Croatia', 'Greece', 'Thailand', 'Portugal'],
  'Sunset Lover':           ['Greece', 'Italy', 'Spain', 'Portugal'],
  'Adventure Junkies':      ['Norway', 'Canada', 'Brazil', 'Australia'],
  'Majestic Mountains':     ['Switzerland', 'Norway', 'Canada', 'Germany'],
  'Tropical Escapes':       ['Thailand', 'Brazil', 'Australia', 'Mexico'],
  'Temples and Traditions': ['Japan', 'India', 'Egypt', 'Turkey'],
  'City Lights':            ['New York', 'Japan', 'Germany', 'Netherlands'],
  'Wild Encounters':        ['South Africa', 'Brazil', 'Australia', 'India'],
  'Water Adventures':       ['Croatia', 'Greece', 'Australia', 'Brazil'],
  'Starry Nights':          ['Norway', 'Canada', 'Egypt', 'Australia'],
  'Spring Blooms':          ['Netherlands', 'Japan', 'Paris', 'Germany'],
  'Offbeat Trails':         ['Turkey', 'Mexico', 'Portugal', 'Croatia'],
  'Wander Alone':           ['Japan', 'Norway', 'Italy', 'Spain'],
  'Romantic Getaways':      ['Paris', 'Italy', 'Greece', 'Switzerland'],
  'Autumn Trails':          ['Germany', 'Japan', 'Canada', 'Netherlands'],
};

const VIBES = [
  { label: 'All',      emoji: '🌍', categories: null },
  { label: 'Chill',    emoji: '🏖️', categories: ['Secluded Shores','Tropical Escapes','Romantic Getaways','Snowy Escapes'] },
  { label: 'Active',   emoji: '🥾', categories: ['Adventure Junkies','Offbeat Trails','Water Adventures','Majestic Mountains','Wander Alone'] },
  { label: 'Moody',    emoji: '🌌', categories: ['Starry Nights','City Lights','Autumn Trails','Sunset Lover'] },
  { label: 'Cultural', emoji: '🏛️', categories: ['Temples and Traditions','Spring Blooms','Wild Encounters'] },
];

const HEIGHTS = ['h-[220px]','h-[300px]','h-[260px]','h-[340px]','h-[200px]','h-[280px]'];

function GalleryCard({ category, imgUrl, index, onOpen }) {
  const [hovered, setHovered] = useState(false);
  const height = HEIGHTS[index % HEIGHTS.length];
  return (
    <div
      className={`relative ${height} rounded-2xl overflow-hidden cursor-pointer mb-4 break-inside-avoid`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpen({ category, imgUrl })}
    >
      <img
        src={imgUrl} alt={category}
        className={`w-full h-full object-cover transition-all duration-500 ${hovered ? 'scale-110 saturate-100' : 'scale-100 saturate-50'}`}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className={`absolute bottom-3 left-3 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="px-3 py-1.5 rounded-xl text-white text-sm font-semibold"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
          {category}
        </div>
      </div>
      {!hovered && (
        <div className="absolute bottom-3 left-3">
          <span className="text-white/60 text-xs font-medium tracking-widest uppercase">{category}</span>
        </div>
      )}
    </div>
  );
}

function DestinationCard({ name, data, imgUrl, onWishlist }) {
  const navigate = useNavigate();
  if (!data) return null;
  return (
    <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <div className="relative h-36 overflow-hidden shrink-0">
        {imgUrl
          ? <img src={imgUrl} alt={name} className="w-full h-full object-cover" />
          : <div className="w-full h-full bg-white/10 animate-pulse" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <h3 className="absolute bottom-2 left-3 text-white font-bold text-base">{name}</h3>
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-white/60 text-xs leading-relaxed line-clamp-3">{data.about}</p>
        <div>
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">Attractions</p>
          <ul className="flex flex-col gap-0.5">
            {data.attractions.map(a => (
              <li key={a} className="flex items-center gap-2 text-white/50 text-xs">
                <span className="h-1 w-1 rounded-full bg-yellow-400 shrink-0" />{a}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-yellow-400 text-xs font-semibold uppercase tracking-widest mb-1">Best Time</p>
          <p className="text-white/50 text-xs">{data.bestTime}</p>
        </div>
        <div className="flex gap-2 mt-auto pt-2">
          <button onClick={() => onWishlist(name)}
            className="flex-1 py-1.5 rounded-full text-xs font-semibold text-white/80 hover:text-white transition-all"
            style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)' }}>
            ♡ Wishlist
          </button>
          <button onClick={() => navigate('/destinations')}
            className="flex-1 py-1.5 rounded-full text-xs font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-all">
            Explore →
          </button>
        </div>
      </div>
    </div>
  );
}

function Lightbox({ item, onClose, onWishlist }) {
  const [destImages, setDestImages] = useState({});
  const destNames = item ? (CATEGORY_DESTINATIONS[item.category] || []) : [];

  useEffect(() => {
    if (!item) return;
    setDestImages({});
    destNames.forEach(name => {
      fetchImage(name).then(url => {
        if (url) setDestImages(prev => ({ ...prev, [name]: url }));
      });
    });
  }, [item?.category]);

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(14px)' }}
      onClick={onClose}>
      <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl my-8"
        style={{ background: 'rgba(15,15,15,0.97)', border: '1px solid rgba(255,255,255,0.1)' }}
        onClick={e => e.stopPropagation()}>

        {/* Hero */}
        <div className="relative h-52 overflow-hidden">
          <img src={item.imgUrl} alt={item.category} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-5">
            <p className="text-yellow-400 text-xs uppercase tracking-widest mb-1">✦ {item.category}</p>
            <h2 className="text-white text-2xl font-extrabold">Destinations to Explore</h2>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 flex items-center justify-center rounded-full text-white hover:bg-white/20 transition-all"
            style={{ background: 'rgba(0,0,0,0.5)' }}>✕</button>
        </div>

        {/* Destination grid */}
        <div className="p-5">
          <p className="text-white/40 text-xs uppercase tracking-widest mb-4">
            {destNames.length} destinations match this vibe
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {destNames.map(name => (
              <DestinationCard key={name} name={name} data={destinations[name]}
                imgUrl={destImages[name]} onWishlist={onWishlist} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GalleryPage() {
  const [cards, setCards] = useState([]);
  const [activeVibe, setActiveVibe] = useState('All');
  const [lightboxItem, setLightboxItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      setLoading(true);
      const results = await Promise.all(
        galleryCategories.map(async (category) => {
          const imgUrl = await fetchImage(category);
          return imgUrl ? { category, imgUrl } : null;
        })
      );
      setCards(results.filter(Boolean));
      setLoading(false);
    }
    loadGallery();
  }, []);

  const filtered = activeVibe === 'All'
    ? cards
    : cards.filter(c => VIBES.find(v => v.label === activeVibe)?.categories?.includes(c.category));

  const handleWishlist = useCallback((name) => {
    fetchImage(name).then(url => { if (url) localStorage.setItem(name, JSON.stringify(url)); });
  }, []);

  return (
    <div className="min-h-screen pt-[60px] bg-black" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} onWishlist={handleWishlist} />

      <div className="text-center pt-14 pb-8 px-4">
        <p className="text-yellow-400 uppercase tracking-[0.3em] text-xs font-semibold mb-3">✦ Visual Stories</p>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4">
          The <span className="text-yellow-400">Gallery</span>
        </h1>
        <p className="text-white/50 text-lg max-w-xl mx-auto" style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
          "A glimpse into the dreams that wanderers dare to see — explore, feel, and get inspired."
        </p>
      </div>

      <div className="flex items-center gap-2 px-6 pb-8 overflow-x-auto justify-center flex-wrap">
        {VIBES.map(({ label, emoji }) => (
          <button key={label} onClick={() => setActiveVibe(label)}
            className={`flex items-center gap-1.5 px-5 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
              activeVibe === label ? 'bg-yellow-400 text-black shadow-[0_0_14px_rgba(250,204,21,0.5)]' : 'text-white/70 hover:text-white border border-white/15 hover:border-white/30'
            }`}
            style={activeVibe !== label ? { background: 'rgba(255,255,255,0.07)' } : {}}>
            <span>{emoji}</span> {label}
          </button>
        ))}
      </div>

      <div className="px-6 pb-16">
        {loading ? (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {[...Array(12)].map((_, i) => (
              <div key={i} className={`${HEIGHTS[i % HEIGHTS.length]} rounded-2xl mb-4 animate-pulse`}
                style={{ background: 'rgba(255,255,255,0.07)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-white/40 py-20">No images for this vibe yet.</p>
        ) : (
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4">
            {filtered.map(({ category, imgUrl }, i) => (
              <GalleryCard key={category} category={category} imgUrl={imgUrl} index={i} onOpen={setLightboxItem} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default GalleryPage;
