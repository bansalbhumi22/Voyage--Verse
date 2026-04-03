import { useState, useEffect, useRef } from 'react';
import DestinationCard from '../DestinationCard/DestinationCard.jsx';
import { fetchImages, chooseDestinations } from '../../services/unsplashService.js';

export const CARD_WIDTH_PX = 280;

export default function DestinationsCarousel() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const scrollRef = useRef(null);

  // Track scroll position to update boundary state
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function handleScroll() {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setAtStart(scrollLeft === 0);
      setAtEnd(scrollLeft >= scrollWidth - clientWidth - 1);
    }

    el.addEventListener('scroll', handleScroll, { passive: true });
    // Run once to set initial state
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [cards]);

  // Load cards on mount and set up 10-second refresh interval
  useEffect(() => {
    let isMounted = true;

    async function loadCards() {
      const savedScrollLeft = scrollRef.current ? scrollRef.current.scrollLeft : 0;
      setLoading(true);
      const results = await fetchImages(chooseDestinations());
      if (!isMounted) return;
      setCards(results);
      setLoading(false);
      // Restore scroll position after re-render
      requestAnimationFrame(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollLeft = savedScrollLeft;
        }
      });
    }

    loadCards();

    const intervalId = setInterval(() => {
      if (!isMounted) return;
      const savedScrollLeft = scrollRef.current ? scrollRef.current.scrollLeft : 0;
      fetchImages(chooseDestinations()).then((results) => {
        if (!isMounted) return;
        setCards(results);
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollLeft = savedScrollLeft;
          }
        });
      });
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  function scrollPrev() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -CARD_WIDTH_PX, behavior: 'smooth' });
    }
  }

  function scrollNext() {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: CARD_WIDTH_PX, behavior: 'smooth' });
    }
  }

  if (loading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="shrink-0 w-[280px] h-[220px] bg-gray-700 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="relative">
      {cards.length > 0 && (
        <button
          onClick={scrollPrev}
          disabled={atStart}
          aria-label="Previous destinations"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ‹
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory px-1"
      >
        {cards.map(({ destination, imgUrl }) => (
          <div key={destination} className="snap-start shrink-0 w-[280px]">
            <DestinationCard destination={destination} imgUrl={imgUrl} />
          </div>
        ))}
      </div>

      {cards.length > 0 && (
        <button
          onClick={scrollNext}
          disabled={atEnd}
          aria-label="Next destinations"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed transition"
        >
          ›
        </button>
      )}
    </div>
  );
}
