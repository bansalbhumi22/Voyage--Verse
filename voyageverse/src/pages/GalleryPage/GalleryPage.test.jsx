// Feature: vanilla-to-react-migration, Property 7: Gallery cards display category name as caption
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import fc from 'fast-check';
import GalleryPage from './GalleryPage.jsx';
import { galleryCategories } from '../../data/destinations.js';
import * as unsplashService from '../../services/unsplashService.js';

beforeEach(() => {
  vi.restoreAllMocks();
});

// --- Unit tests (9.2) ---

describe('GalleryPage unit tests', () => {
  test('renders "Gallery" heading', async () => {
    vi.spyOn(unsplashService, 'fetchImage').mockResolvedValue(null);
    render(<GalleryPage />);
    expect(screen.getByText('Gallery')).toBeTruthy();
  });

  test('galleryCategories has exactly 16 entries', () => {
    expect(galleryCategories).toHaveLength(16);
  });
});

// --- Property test (9.1) ---
// Property 7: Gallery cards display category name as caption
// Validates: Requirements 6.2

describe('GalleryPage property tests', () => {
  test('Property 7: each rendered card contains the image and matching caption text', async () => {
    await fc.assert(
      fc.asyncProperty(
        // Generate a subset of category indices with valid image URLs
        fc.array(
          fc.record({
            index: fc.integer({ min: 0, max: galleryCategories.length - 1 }),
            imgUrl: fc.webUrl(),
          }),
          { minLength: 1, maxLength: galleryCategories.length }
        ),
        async (entries) => {
          vi.restoreAllMocks();

          // Deduplicate by index, keeping last occurrence
          const byIndex = new Map(entries.map((e) => [e.index, e.imgUrl]));

          vi.spyOn(unsplashService, 'fetchImage').mockImplementation(async (category) => {
            const idx = galleryCategories.indexOf(category);
            return byIndex.get(idx) ?? null;
          });

          const { unmount } = render(<GalleryPage />);

          await waitFor(() => {
            const expectedCount = byIndex.size;
            const imgs = document.querySelectorAll('img[alt]');
            // At least the expected number of cards should be rendered
            expect(imgs.length).toBeGreaterThanOrEqual(expectedCount);
          });

          // For each category that should have a card, verify caption text is present
          for (const [idx] of byIndex) {
            const category = galleryCategories[idx];
            expect(screen.getByText(category)).toBeTruthy();
          }

          unmount();
        }
      ),
      { numRuns: 20 } // reduced runs due to async rendering overhead
    );
  });
});
