// Feature: vanilla-to-react-migration, Task 12.1: Background image application
import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from './Dashboard.jsx'

// Mock unsplashService to avoid real API calls
vi.mock('../../services/unsplashService', () => ({
  fetchImages: vi.fn().mockResolvedValue([]),
  chooseDestinations: vi.fn().mockReturnValue([]),
}))

// Mock the world-map asset
vi.mock('../../assets/world-map.png', () => ({ default: 'world-map.png' }))

describe('Dashboard background image (Requirement 9.3)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('renders world map background image in hero section', () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    )
    const bgImg = screen.getByAltText('world map background')
    expect(bgImg).toBeTruthy()
    expect(bgImg.getAttribute('src')).toBe('world-map.png')
  })
})
