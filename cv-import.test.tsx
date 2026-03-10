import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CVImport } from './components/cv-import';
import { useCVStore } from './lib/store';

// Mock the store
vi.mock('./lib/store', () => ({
  useCVStore: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock GoogleGenAI
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    models: {
      generateContent: vi.fn().mockResolvedValue({
        text: JSON.stringify({
          personalInfo: { fullName: 'AI Generated Name' },
          experience: [],
        }),
      }),
    },
  })),
}));

describe('CVImport Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCVStore as any).mockReturnValue({
      setCVData: vi.fn(),
    });
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      clear: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
  });

  it('renders Import CV từ AI button', () => {
    render(<CVImport />);
    expect(screen.getByText('Nhập CV từ AI')).toBeInTheDocument();
  });

  it('opens dialog when button is clicked', () => {
    render(<CVImport />);
    const importButton = screen.getByText('Nhập CV từ AI');
    fireEvent.click(importButton);
    
    expect(screen.getByText('Import CV cũ của bạn')).toBeInTheDocument();
    expect(screen.getByText('Tải file (PDF/Ảnh)')).toBeInTheDocument();
    expect(screen.getByText('Dán văn bản')).toBeInTheDocument();
  });
});
