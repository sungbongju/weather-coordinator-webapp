import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { GenderToggle } from '../GenderToggle';

// preferenceStore mock
let mockGender: 'M' | 'F' | null = null;
const mockSetGender = vi.fn();

vi.mock('@/store/preferenceStore', () => ({
  usePreferenceStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      preferences: { dislikedItemIds: [], gender: mockGender },
      setGender: mockSetGender,
    }),
}));

describe('GenderToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGender = null;
  });

  it('남성/여성 버튼이 렌더된다', () => {
    render(<GenderToggle />);
    expect(screen.getByText('남성')).toBeInTheDocument();
    expect(screen.getByText('여성')).toBeInTheDocument();
  });

  it('초기 상태: 둘 다 선택되지 않는다', () => {
    render(<GenderToggle />);
    expect(screen.getByTestId('gender-toggle-M')).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('gender-toggle-F')).toHaveAttribute('aria-checked', 'false');
  });

  it('남성 클릭 시 setGender(M)이 호출된다', () => {
    render(<GenderToggle />);
    fireEvent.click(screen.getByTestId('gender-toggle-M'));
    expect(mockSetGender).toHaveBeenCalledWith('M');
  });

  it('여성 클릭 시 setGender(F)이 호출된다', () => {
    render(<GenderToggle />);
    fireEvent.click(screen.getByTestId('gender-toggle-F'));
    expect(mockSetGender).toHaveBeenCalledWith('F');
  });

  it('이미 선택된 남성 재클릭 시 setGender(null)이 호출된다', () => {
    mockGender = 'M';
    render(<GenderToggle />);
    fireEvent.click(screen.getByTestId('gender-toggle-M'));
    expect(mockSetGender).toHaveBeenCalledWith(null);
  });

  it("gender='M'이면 남성 버튼에 활성 스타일이 적용된다", () => {
    mockGender = 'M';
    render(<GenderToggle />);
    expect(screen.getByTestId('gender-toggle-M')).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('gender-toggle-F')).toHaveAttribute('aria-checked', 'false');
  });
});
