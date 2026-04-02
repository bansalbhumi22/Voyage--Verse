// Feature: vanilla-to-react-migration, Property 5: Destination details completeness
// Feature: vanilla-to-react-migration, Property 6: Destination search updates displayed details
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import fc from 'fast-check'
import DestinationDetailsPage from './DestinationDetailsPage.jsx'
import { destinations } from '../../data/destinations.js'
import * as unsplashService from '../../services/unsplashService.js'

// Mock fetchImage to avoid real network calls
beforeEach(() => {
  vi.spyOn(unsplashService, 'fetchImage').mockResolvedValue('https://example.com/test.jpg')
  vi.spyOn(window, 'alert').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

// ─── Property 5: Destination details completeness ────────────────────────────
// Validates: Requirements 5.5, 5.7
describe('Property 5: Destination details completeness', () => {
  test('For each of the 7 predefined destinations, all detail fields render', async () => {
    const destKeys = Object.keys(destinations)

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...destKeys),
        async (destName) => {
          const { unmount } = render(<DestinationDetailsPage />)

          // Wait for Italy to load first (default mount)
          await waitFor(() => {
            expect(screen.getByText('Italy')).toBeInTheDocument()
          })

          // Type the destination into the search bar and submit
          const input = screen.getByPlaceholderText('Search destination')
          fireEvent.change(input, { target: { value: destName } })
          fireEvent.click(screen.getByRole('button', { name: /🔍/ }))

          await waitFor(() => {
            expect(screen.getByText(destName)).toBeInTheDocument()
          })

          const details = destinations[destName]

          // Name
          expect(screen.getByText(destName)).toBeInTheDocument()
          // Tagline
          expect(screen.getByText(`Explore ${destName}!`)).toBeInTheDocument()
          // About
          expect(screen.getByText(details.about)).toBeInTheDocument()
          // At least one attraction
          expect(screen.getByText(details.attractions[0])).toBeInTheDocument()
          // Weather
          expect(screen.getByText(details.weather)).toBeInTheDocument()

          unmount()
        }
      ),
      { numRuns: 7 }
    )
  })
})

// ─── Property 6: Destination search updates displayed details ─────────────────
// Validates: Requirements 5.3
describe('Property 6: Destination search updates displayed details', () => {
  test('Submitting a valid destination name updates all detail fields', async () => {
    const destKeys = Object.keys(destinations)

    await fc.assert(
      fc.asyncProperty(
        fc.constantFrom(...destKeys),
        async (destName) => {
          const { unmount } = render(<DestinationDetailsPage />)

          await waitFor(() => {
            expect(screen.getByText('Italy')).toBeInTheDocument()
          })

          const input = screen.getByPlaceholderText('Search destination')
          fireEvent.change(input, { target: { value: destName } })
          fireEvent.click(screen.getByRole('button', { name: /🔍/ }))

          const details = destinations[destName]

          await waitFor(() => {
            expect(screen.getByText(destName)).toBeInTheDocument()
            expect(screen.getByText(`Explore ${destName}!`)).toBeInTheDocument()
            expect(screen.getByText(details.about)).toBeInTheDocument()
            expect(screen.getByText(details.weather)).toBeInTheDocument()
          })

          unmount()
        }
      ),
      { numRuns: 7 }
    )
  })
})

// ─── Unit tests ───────────────────────────────────────────────────────────────
// Validates: Requirements 5.1, 5.4, 5.6
describe('DestinationDetailsPage unit tests', () => {
  test('shows Italy details on mount', async () => {
    render(<DestinationDetailsPage />)

    await waitFor(() => {
      expect(screen.getByText('Italy')).toBeInTheDocument()
      expect(screen.getByText('Explore Italy!')).toBeInTheDocument()
      expect(screen.getByText(destinations.Italy.about)).toBeInTheDocument()
      expect(screen.getByText(destinations.Italy.weather)).toBeInTheDocument()
    })
  })

  test('shows alert on empty search', async () => {
    render(<DestinationDetailsPage />)

    await waitFor(() => screen.getByText('Italy'))

    const input = screen.getByPlaceholderText('Search destination')
    fireEvent.change(input, { target: { value: '   ' } })
    fireEvent.click(screen.getByRole('button', { name: /🔍/ }))

    expect(window.alert).toHaveBeenCalledWith('Please enter a destination name.')
  })

  test('shows alert for unknown destination', async () => {
    render(<DestinationDetailsPage />)

    await waitFor(() => screen.getByText('Italy'))

    const input = screen.getByPlaceholderText('Search destination')
    fireEvent.change(input, { target: { value: 'Atlantis' } })
    fireEvent.click(screen.getByRole('button', { name: /🔍/ }))

    expect(window.alert).toHaveBeenCalledWith('Details not found for this destination.')
  })

  test('renders search bar and search button', async () => {
    render(<DestinationDetailsPage />)
    expect(screen.getByPlaceholderText('Search destination')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /🔍/ })).toBeInTheDocument()
  })
})
