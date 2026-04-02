// Feature: vanilla-to-react-migration, Property 3: Error resilience — failed image fetches are skipped
import { describe, test, vi, afterEach } from 'vitest';
import fc from 'fast-check';
import { fetchImages } from './unsplashService.js';

/**
 * Validates: Requirements 3.6, 4.7, 6.4
 *
 * Property 3: For any N failures out of 7 fetches, fetchImages returns exactly 7 − N results.
 * Failures are simulated by making fetch() return a non-OK response or empty results.
 */
describe('unsplashService', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Property 3: fetchImages filters out null results from failed fetches', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.boolean(), { minLength: 7, maxLength: 7 }),
        async (successFlags) => {
          const destinations = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
          const expectedCount = successFlags.filter(Boolean).length;

          let callIndex = 0;
          vi.spyOn(globalThis, 'fetch').mockImplementation(async () => {
            const idx = callIndex++;
            const success = successFlags[idx];
            if (!success) {
              return { ok: false, json: async () => ({ results: [] }) };
            }
            return {
              ok: true,
              json: async () => ({
                results: [{ urls: { regular: `https://example.com/${destinations[idx]}.jpg` } }],
              }),
            };
          });

          const results = await fetchImages(destinations);
          return results.length === expectedCount;
        }
      ),
      { numRuns: 100 }
    );
  });
});
