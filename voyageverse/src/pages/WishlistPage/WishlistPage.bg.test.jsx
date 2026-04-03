// Feature: vanilla-to-react-migration, Task 12.1: Background image application
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import WishlistPage from './WishlistPage.jsx'
import { ThemeProvider } from '../../context/ThemeContext.jsx'

// Mock unsplashService
vi.mock('../../services/unsplashService.js', () => ({
  fetchImage: vi.fn().mockResolvedValue(null),
}))

// Mock the wishlist-bg asset
vi.mock('../../assets/wishlist-bg.jpg', () => ({ default: 'wishlist-bg.jpg' }))

describe('WishlistPage background image (Requirement 9.3)', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  test('applies wishlist background image via inline style on root element', () => {
    const { container } = render(<ThemeProvider><WishlistPage /></ThemeProvider>)
    const root = container.firstChild
    expect(root.style.background).toContain('wishlist-bg.jpg')
  })
})
