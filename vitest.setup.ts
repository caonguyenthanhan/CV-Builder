import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/font/google
vi.mock('next/font/google', () => ({
  Inter: () => ({
    style: {
      fontFamily: 'mocked',
    },
    className: 'mocked',
    variable: '--font-inter',
  }),
  JetBrains_Mono: () => ({
    style: {
      fontFamily: 'mocked',
    },
    className: 'mocked',
    variable: '--font-mono',
  }),
}))

// Mock next/image
vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return null;
  },
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
