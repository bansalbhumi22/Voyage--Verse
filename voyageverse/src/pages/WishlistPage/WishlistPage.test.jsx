// Feature: vanilla-to-react-migration, Property 8: Wishlist localStorage round trip
// Feature: vanilla-to-react-migration, Property 9: Wishlist item deletion removes from localStorage and UI
// Feature: vanilla-to-react-migration, Property 10: Search input cleared after successful wishlist add
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, cleanup, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import WishlistPage from './WishlistPage.jsx';
import * as unsplashService from '../../services/unsplashService.js';

// Helper: clear localStorage and restore mocks between tests
beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

afterEach(() => {
  localStorage.clear();
});

// --- Unit tests (10.4) ---

describe('WishlistPage unit tests', () => {
  test('renders search bar and search button', () => {
    render(<WishlistPage />);
    expect(document.querySelector('#search-bar')).toBeTruthy();
    expect(document.querySelector('#search-btn')).toBeTruthy();
  });

  test('does not add card when Unsplash returns no image', async () => {
    vi.spyOn(unsplashService, 'fetchImage').mockResolvedValue(null);
    render(<WishlistPage />);

    const input = document.querySelector('#search-bar');
    const btn = document.querySelector('#search-btn');

    fireEvent.change(input, { target: { value: 'UnknownPlace' } });
    fireEvent.click(btn);

    // Wait a tick for async to settle
    await waitFor(() => {
      expect(localStorage.getItem('UnknownPlace')).toBeNull();
    });

    // No WishlistItem cards should be rendered
    expect(screen.queryByAltText('UnknownPlace')).toBeNull();
  });
});

// --- Property tests ---

// Property 8: Wishlist localStorage round trip
// Validates: Requirements 7.1, 7.4
describe('Property 8: Wishlist localStorage round trip', () => {
  test('renders a card for every entry stored in localStorage on mount', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            destination: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
            imgUrl: fc.webUrl(),
          }),
          { minLength: 1, maxLength: 8 }
        ),
        async (entries) => {
          localStorage.clear();
          cleanup();

          // Deduplicate by destination name
          const unique = [...new Map(entries.map((e) => [e.destination, e])).values()];

          // Pre-populate localStorage
          for (const { destination, imgUrl } of unique) {
            localStorage.setItem(destination, JSON.stringify(imgUrl));
          }

          const { container, unmount } = render(<WishlistPage />);
          const view = within(container);

          // Each destination should appear as an alt text on an img
          for (const { destination } of unique) {
            await waitFor(() => {
              const imgs = container.querySelectorAll(`img[alt="${CSS.escape(destination)}"]`);
              expect(imgs.length).toBeGreaterThanOrEqual(1);
            });
          }

          unmount();
          cleanup();
          localStorage.clear();
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});

// Property 9: Wishlist item deletion removes from localStorage and UI
// Validates: Requirements 7.5
describe('Property 9: Wishlist item deletion removes from localStorage and UI', () => {
  test('deleting an item removes it from localStorage and the rendered list', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(
          fc.record({
            destination: fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
            imgUrl: fc.webUrl(),
          }),
          { minLength: 2, maxLength: 6 }
        ),
        fc.integer({ min: 0, max: 5 }),
        async (entries, deleteIndexRaw) => {
          localStorage.clear();
          cleanup();

          // Deduplicate
          const unique = [...new Map(entries.map((e) => [e.destination, e])).values()];
          if (unique.length < 2) return; // need at least 2 items

          for (const { destination, imgUrl } of unique) {
            localStorage.setItem(destination, JSON.stringify(imgUrl));
          }

          const deleteIndex = deleteIndexRaw % unique.length;
          const toDelete = unique[deleteIndex];

          const { container, unmount } = render(<WishlistPage />);
          const view = within(container);

          // Wait for items to render
          await waitFor(() => {
            const imgs = container.querySelectorAll(`img[alt="${CSS.escape(toDelete.destination)}"]`);
            expect(imgs.length).toBeGreaterThanOrEqual(1);
          });

          // Click the delete button for the target item
          const allBtns = Array.from(container.querySelectorAll('button[aria-label]'));
          const deleteBtn = allBtns.find(btn => btn.getAttribute('aria-label') === `Delete ${toDelete.destination}`);
          expect(deleteBtn).toBeTruthy();
          fireEvent.click(deleteBtn);

          // Item should be gone from UI and localStorage
          await waitFor(() => {
            const imgs = container.querySelectorAll(`img[alt="${CSS.escape(toDelete.destination)}"]`);
            expect(imgs.length).toBe(0);
          });
          expect(localStorage.getItem(toDelete.destination)).toBeNull();

          // All other items should still be present
          for (const { destination } of unique) {
            if (destination === toDelete.destination) continue;
            const imgs = container.querySelectorAll(`img[alt="${CSS.escape(destination)}"]`);
            expect(imgs.length).toBeGreaterThanOrEqual(1);
            expect(localStorage.getItem(destination)).not.toBeNull();
          }

          unmount();
          cleanup();
          localStorage.clear();
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});

// Property 10: Search input cleared after successful wishlist add
// Validates: Requirements 7.6
describe('Property 10: Search input cleared after successful wishlist add', () => {
  test('search input is empty after a successful add', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.string({ minLength: 1, maxLength: 20 }).filter((s) => s.trim().length > 0),
        fc.webUrl(),
        async (destination, imgUrl) => {
          localStorage.clear();
          vi.restoreAllMocks();
          vi.spyOn(unsplashService, 'fetchImage').mockResolvedValue(imgUrl);

          const { unmount } = render(<WishlistPage />);

          const input = document.querySelector('#search-bar');
          const btn = document.querySelector('#search-btn');

          fireEvent.change(input, { target: { value: destination } });
          fireEvent.click(btn);

          await waitFor(() => {
            expect(input.value).toBe('');
          });

          unmount();
          localStorage.clear();
        }
      ),
      { numRuns: 20 }
    );
  }, 30000);
});
