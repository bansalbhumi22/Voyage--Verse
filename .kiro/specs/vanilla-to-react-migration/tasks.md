# Implementation Plan: VoyageVerse — Vanilla to React Migration

## Overview

Migrate the VoyageVerse multi-page vanilla JS/HTML/CSS app into a React SPA using Vite, React Router v6, and Tailwind CSS v3. Each original HTML page becomes a route component. Firebase is removed entirely. Images come from Unsplash, wishlist data persists in localStorage, and the review form is client-side only.

## Tasks

- [x] 1. Set up Vite + React project and install dependencies
  - Scaffold a new Vite project with the React template (`npm create vite@latest`)
  - Install `react-router-dom@6`, `tailwindcss@3`, `postcss`, `autoprefixer`
  - Run `npx tailwindcss init -p` to generate `tailwind.config.js` and `postcss.config.js`
  - Configure `tailwind.config.js` content paths to `['./index.html', './src/**/*.{js,jsx}']`
  - Replace generated `src/index.css` with the three Tailwind directives only
  - Install `vitest`, `@vitest/ui`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, and `fast-check` as dev dependencies
  - Add `vitest.config.js` with `environment: 'jsdom'`, `globals: true`, `setupFiles: './src/test/setup.js'`
  - Create `src/test/setup.js` importing `@testing-library/jest-dom`
  - Copy static assets (logo, hero background, wishlist background, world map image) into `src/assets/`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implement `unsplashService.js` and shared data
  - Create `src/services/unsplashService.js` with `fetchImage(query)`, `fetchImages(destinations)`, and `chooseDestinations()` functions
  - `fetchImage` calls the Unsplash search API, returns the first result's `urls.regular` or `null` on error/empty
  - `fetchImages` calls `fetchImage` in parallel and filters out null results, returning `CardData[]`
  - `chooseDestinations` picks 7 unique random entries from the `places` array
  - Create `src/data/destinations.js` exporting `destinations` (Record with Italy, Paris, Spain, Australia, India, Egypt, Japan), `galleryCategories` (16 entries), and `places` (31 entries)
  - _Requirements: 1.1, 3.4, 3.6, 4.5, 4.7, 5.7, 6.1, 6.5_

  - [ ]* 2.1 Write property test for `fetchImages` error resilience
    - **Property 3: Error resilience — failed image fetches are skipped**
    - **Validates: Requirements 3.6, 4.7, 6.4**
    - Mock `fetchImage` to fail for N random indices out of 7; assert returned array length === 7 − N

- [x] 3. Implement `Navbar` component and `App.jsx` routing
  - Create `src/components/Navbar/Navbar.jsx` using Tailwind utility classes; render logo from `src/assets/` and `<Link>` elements for `/`, `/dashboard`, `/destinations`, `/gallery`, `/wishlist`, `/review`
  - Create `src/App.jsx` wrapping all routes in `<BrowserRouter>` with `<Navbar />` above `<Routes>`; define all six `<Route>` entries
  - Update `src/main.jsx` to render `<App />`
  - _Requirements: 1.2, 2.1, 2.2, 2.3_

  - [ ]* 3.1 Write unit tests for `Navbar`
    - Assert logo is rendered
    - Assert all six navigation links are present with correct `href` values
    - _Requirements: 2.1, 2.2_

  - [ ]* 3.2 Write property test for SPA navigation
    - **Property 4: SPA navigation does not cause full page reload**
    - **Validates: Requirements 2.3**
    - For each route path, click the corresponding Navbar link and assert URL updates without full reload

- [x] 4. Implement `DestinationCard` and `WishlistItem` shared components
  - Create `src/components/DestinationCard/DestinationCard.jsx` accepting `destination` (string) and `imgUrl` (string) props; render image with destination name overlay using Tailwind
  - Create `src/components/WishlistItem/WishlistItem.jsx` accepting `destination`, `imgUrl`, and `onDelete` props; render card with trash icon button that calls `onDelete(destination)`
  - _Requirements: 3.3, 4.4, 7.1, 7.5_

- [x] 5. Implement `LandingPage`
  - Create `src/pages/LandingPage/LandingPage.jsx`
  - Render hero section with background image, tagline, and navigation buttons linking to `/dashboard` and other pages using `<Link>`
  - On mount, call `unsplashService.fetchImages(chooseDestinations())` and store results in `cards` state; render a `<DestinationCard>` for each
  - Set up a `setInterval` (10 000 ms) in `useEffect` to re-fetch and replace `cards`; clear interval on unmount
  - Skip cards where `imgUrl` is null/undefined
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6_

  - [ ]* 5.1 Write property test for destination card fetch count
    - **Property 1: Destination card fetch count on mount**
    - **Validates: Requirements 3.4, 4.5**
    - Mock `fetchImages` to return 7 cards; assert exactly 7 `DestinationCard` components render

  - [ ]* 5.2 Write property test for destination card refresh interval
    - **Property 2: Destination card refresh on interval**
    - **Validates: Requirements 3.5, 4.6**
    - Use fake timers; advance by 10 000 ms; assert cards are replaced with a new set

  - [ ]* 5.3 Write unit tests for `LandingPage`
    - Assert hero section and tagline render
    - Assert navigation buttons are present
    - _Requirements: 3.1, 3.2_

- [x] 6. Implement `Dashboard`
  - Create `src/pages/Dashboard/Dashboard.jsx`
  - Render hero section with background image, tagline, and "Create Your Own Wishlist" button (`<Link to="/wishlist">`)
  - Render description section with links to `/wishlist` and `/destinations`
  - On mount, fetch and display 7 destination cards; refresh every 10 s (same pattern as LandingPage)
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7_

  - [ ]* 6.1 Write property test for Dashboard card fetch count
    - **Property 1: Destination card fetch count on mount (Dashboard)**
    - **Validates: Requirements 4.5**
    - Mock `fetchImages` to return 7 cards; assert exactly 7 `DestinationCard` components render

  - [ ]* 6.2 Write unit tests for `Dashboard`
    - Assert hero section, tagline, and "Create Your Own Wishlist" button render
    - Assert description section links are present
    - _Requirements: 4.1, 4.3_

- [x] 7. Checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement `DestinationDetailsPage`
  - Create `src/pages/DestinationDetailsPage/DestinationDetailsPage.jsx`
  - On mount, default to "Italy": fetch image from Unsplash and load details from `destinations.js`
  - Render search bar and search button; on submit with non-empty term, fetch image and look up details; show `alert()` if term is empty or destination not found
  - Render destination name, "Explore [destination]!" tagline, about section, top attractions list, weather section, and user review quote
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7_

  - [ ]* 8.1 Write property test for destination details completeness
    - **Property 5: Destination details completeness**
    - **Validates: Requirements 5.5, 5.7**
    - For each of the 7 predefined destinations, assert name, tagline, about, attractions, and weather all render

  - [ ]* 8.2 Write property test for destination search update
    - **Property 6: Destination search updates displayed details**
    - **Validates: Requirements 5.3**
    - Generate random valid destination names from the predefined set; submit via search bar; assert all detail fields update

  - [ ]* 8.3 Write unit tests for `DestinationDetailsPage`
    - Assert Italy details shown on mount
    - Assert alert on empty search
    - Assert alert for unknown destination
    - _Requirements: 5.1, 5.4, 5.6_

- [x] 9. Implement `GalleryPage`
  - Create `src/pages/GalleryPage/GalleryPage.jsx`
  - On mount, call `fetchImage` for each of the 16 `galleryCategories` in parallel; store results in `cards` state
  - Render heading "Gallery", inspirational caption, and a card grid; each card shows the image and category name as caption; skip failed fetches
  - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

  - [ ]* 9.1 Write property test for gallery card captions
    - **Property 7: Gallery cards display category name as caption**
    - **Validates: Requirements 6.2**
    - Generate random category names and image URLs; assert each rendered card contains both the image and the matching caption text

  - [ ]* 9.2 Write unit tests for `GalleryPage`
    - Assert "Gallery" heading renders
    - Assert `galleryCategories` array has exactly 16 entries
    - _Requirements: 6.3, 6.5_

- [x] 10. Implement `WishlistPage`
  - Create `src/pages/WishlistPage/WishlistPage.jsx`
  - On mount, read all `localStorage` keys and reconstruct `items` state as `{destination, imgUrl}[]`
  - Render search bar and search button; on submit (click or Enter) with non-empty term, call `fetchImage`; if image returned, save to `localStorage` and append to `items`, then clear input; if no image, log and skip
  - Render a `<WishlistItem>` for each item; pass `onDelete` handler that removes the key from `localStorage` and filters the item from state
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

  - [ ]* 10.1 Write property test for wishlist localStorage round trip
    - **Property 8: Wishlist localStorage round trip**
    - **Validates: Requirements 7.1, 7.4**
    - Generate random destination names and URLs; save to localStorage; mount page; assert a card renders for every stored entry

  - [ ]* 10.2 Write property test for wishlist item deletion
    - **Property 9: Wishlist item deletion removes from localStorage and UI**
    - **Validates: Requirements 7.5**
    - Populate localStorage with N items; click delete on one; assert N−1 items remain in both localStorage and rendered list

  - [ ]* 10.3 Write property test for search input cleared after add
    - **Property 10: Search input cleared after successful wishlist add**
    - **Validates: Requirements 7.6**
    - Generate random valid destination names; after successful add, assert search input value is empty

  - [ ]* 10.4 Write unit tests for `WishlistPage`
    - Assert search bar and button render
    - Assert no card added when Unsplash returns no image
    - _Requirements: 7.2, 7.7_

- [x] 11. Implement `ReviewPage`
  - Create `src/pages/ReviewPage/ReviewPage.jsx`
  - Render form with destination text input and review textarea
  - On submit: if either field is empty/whitespace, set error message and do not reset; if both are filled, show success message and reset both fields to empty strings
  - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 11.1 Write property test for valid review submission
    - **Property 11: Review form valid submission resets state**
    - **Validates: Requirements 8.2**
    - Generate random non-empty destination and review strings; submit form; assert success message shown and both fields cleared

  - [ ]* 11.2 Write property test for invalid review submission
    - **Property 12: Review form invalid submission shows validation message**
    - **Validates: Requirements 8.3**
    - Generate form states with at least one empty/whitespace field; submit; assert validation message shown and form not reset

  - [ ]* 11.3 Write unit tests for `ReviewPage`
    - Assert destination input and review textarea render
    - _Requirements: 8.1_

- [x] 12. Apply Tailwind styling to all pages and components
  - Apply Tailwind utility classes to all page components to match the original visual design
  - Apply `bg-[url(...)]` or inline `style` for background images on Dashboard (`world-map.png`) and WishlistPage (`wishlist-bg.jpg`)
  - Ensure all original class names and element IDs referenced in the original CSS are preserved or mapped to equivalent Tailwind classes
  - _Requirements: 9.1, 9.2, 9.3_

  - [ ]* 12.1 Write unit tests for background image application
    - Assert correct background images are applied to Dashboard and WishlistPage
    - _Requirements: 9.3_

- [x] 13. Final checkpoint — Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Property tests use `fast-check` with a minimum of 100 iterations per run
- Unit tests use Vitest + React Testing Library
- Each property test file must include the comment: `// Feature: vanilla-to-react-migration, Property N: <property_text>`
