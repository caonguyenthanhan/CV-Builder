import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DataManager } from './components/data-manager';
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

describe('DataManager Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useCVStore as any).mockReturnValue({
      cvData: { personalInfo: { fullName: 'Test Name' }, experience: [] },
      setCVData: vi.fn(),
    });
  });

  it('renders Export and Import buttons', () => {
    render(<DataManager />);
    expect(screen.getByText('Xuất JSON')).toBeInTheDocument();
    expect(screen.getByText('Nhập JSON')).toBeInTheDocument();
  });

  it('calls handleExport when Export button is clicked', () => {
    const createElementSpy = vi.spyOn(document, 'createElement');
    const appendChildSpy = vi.spyOn(document.body, 'appendChild');
    
    render(<DataManager />);
    const exportButton = screen.getByText('Xuất JSON');
    fireEvent.click(exportButton);
    
    expect(createElementSpy).toHaveBeenCalledWith('a');
    expect(appendChildSpy).toHaveBeenCalled();
    
    createElementSpy.mockRestore();
    appendChildSpy.mockRestore();
  });

  it('opens Import dialog when Import button is clicked', () => {
    render(<DataManager />);
    const importButton = screen.getByText('Nhập JSON');
    fireEvent.click(importButton);
    
    expect(screen.getByText('Import Dữ liệu CV')).toBeInTheDocument();
  });
});
