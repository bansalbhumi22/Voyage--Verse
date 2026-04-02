import { places } from '../data/destinations.js';

const accessKey = "qDPS6Xpg8ile2T-qeT4noCjFsleUxvmDBZSvS7hYNKY";

/**
 * Fetch a single image URL for a query keyword from Unsplash.
 * Returns the first result's urls.regular, or null on error/empty.
 */
export async function fetchImage(query) {
  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&client_id=${accessKey}&per_page=1`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.results[0]?.urls?.regular ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetch images for multiple destinations in parallel.
 * Filters out null results, returns array of { destination, imgUrl }.
 */
export async function fetchImages(destinations) {
  const results = await Promise.all(
    destinations.map(async (destination) => {
      const imgUrl = await fetchImage(destination);
      return imgUrl ? { destination, imgUrl } : null;
    })
  );
  return results.filter(Boolean);
}

/**
 * Pick 7 unique random entries from the places array.
 */
export function chooseDestinations() {
  const chosen = new Set();
  while (chosen.size < 7) {
    const idx = Math.floor(Math.random() * places.length);
    chosen.add(places[idx]);
  }
  return Array.from(chosen);
}
