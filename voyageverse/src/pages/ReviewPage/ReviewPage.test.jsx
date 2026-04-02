// Feature: vanilla-to-react-migration, Property 11: Review form valid submission resets state
// Feature: vanilla-to-react-migration, Property 12: Review form invalid submission shows validation message
import { describe, test, expect } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import fc from 'fast-check'
import ReviewPage from './ReviewPage.jsx'

// --- Unit tests (11.3) ---

describe('ReviewPage unit tests', () => {
  test('renders destination input and review textarea', () => {
    render(<ReviewPage />)
    expect(document.querySelector('#destination')).toBeTruthy()
    expect(document.querySelector('#review')).toBeTruthy()
  })
})

// --- Property 11: valid review submission resets state ---
// Validates: Requirements 8.2

describe('Property 11: Review form valid submission resets state', () => {
  test('success message shown and both fields cleared after valid submit', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (destination, review) => {
          cleanup()
          render(<ReviewPage />)

          const destInput = document.querySelector('#destination')
          const reviewInput = document.querySelector('#review')
          const form = destInput.closest('form')

          fireEvent.change(destInput, { target: { value: destination } })
          fireEvent.change(reviewInput, { target: { value: review } })
          fireEvent.submit(form)

          // Both fields should be cleared
          expect(destInput.value).toBe('')
          expect(reviewInput.value).toBe('')

          // Success message should be visible
          expect(screen.getByText(/submitted successfully/i)).toBeTruthy()

          // No error message
          expect(screen.queryByText(/please fill in/i)).toBeNull()

          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })
})

// --- Property 12: invalid review submission shows validation message ---
// Validates: Requirements 8.3

describe('Property 12: Review form invalid submission shows validation message', () => {
  test('validation message shown and form not reset when at least one field is empty/whitespace', () => {
    fc.assert(
      fc.property(
        // Generate pairs where at least one is empty or whitespace-only
        fc.oneof(
          // destination empty/whitespace, review non-empty
          fc.record({
            destination: fc.constantFrom('', '   '),
            review: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
          }),
          // destination non-empty, review empty/whitespace
          fc.record({
            destination: fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
            review: fc.constantFrom('', '   '),
          }),
          // both empty
          fc.record({
            destination: fc.constantFrom('', '   '),
            review: fc.constantFrom('', '   '),
          })
        ),
        ({ destination, review }) => {
          cleanup()
          render(<ReviewPage />)

          const destInput = document.querySelector('#destination')
          const reviewInput = document.querySelector('#review')
          const form = destInput.closest('form')

          fireEvent.change(destInput, { target: { value: destination } })
          fireEvent.change(reviewInput, { target: { value: review } })
          fireEvent.submit(form)

          // Error message should be visible
          expect(screen.getByText(/please fill in/i)).toBeTruthy()

          // Fields should NOT be reset — they keep their original values
          expect(destInput.value).toBe(destination)
          expect(reviewInput.value).toBe(review)

          // No success message
          expect(screen.queryByText(/submitted successfully/i)).toBeNull()

          cleanup()
        }
      ),
      { numRuns: 100 }
    )
  })
})
