import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PreferencesModal } from '../PreferencesModal';

// framer-motion mock
vi.mock('framer-motion', () => ({
  motion: new Proxy({}, {
    get: (_target, prop: string) => {
      return ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) => {
        const { initial, animate, exit, transition, variants, whileHover, whileTap, ...rest } = props;
        const Tag = prop as keyof JSX.IntrinsicElements;
        return <Tag {...rest}>{children}</Tag>;
      };
    },
  }),
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// preferenceStore mock
const mockToggleDislike = vi.fn();
const mockIsDisliked = vi.fn((_id: string) => false);
const mockClearAllDislikes = vi.fn();

vi.mock('@/store/preferenceStore', () => ({
  usePreferenceStore: (selector: (s: Record<string, unknown>) => unknown) =>
    selector({
      toggleDislike: mockToggleDislike,
      isDisliked: mockIsDisliked,
      clearAllDislikes: mockClearAllDislikes,
      preferences: { dislikedItemIds: [] },
    }),
}));

describe('PreferencesModal', () => {
  const onClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('isOpen=false일 때 렌더하지 않는다', () => {
    render(<PreferencesModal isOpen={false} onClose={onClose} />);
    expect(screen.queryByText('옷장 설정')).not.toBeInTheDocument();
  });

  it('isOpen=true일 때 모달을 표시한다', () => {
    render(<PreferencesModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText('옷장 설정')).toBeInTheDocument();
  });

  it('카테고리별 섹션이 표시된다 (ACCESSORY 제외)', () => {
    render(<PreferencesModal isOpen={true} onClose={onClose} />);
    expect(screen.getByText('아우터')).toBeInTheDocument();
    expect(screen.getByText('상의')).toBeInTheDocument();
    expect(screen.getByText('하의')).toBeInTheDocument();
    expect(screen.getByText('신발')).toBeInTheDocument();
  });

  it('의류 아이템들이 표시된다', () => {
    render(<PreferencesModal isOpen={true} onClose={onClose} />);
    // 의류 데이터에서 알려진 아이템들
    expect(screen.getByText('롱패딩')).toBeInTheDocument();
    expect(screen.getByText('코트')).toBeInTheDocument();
    expect(screen.getByText('히트텍')).toBeInTheDocument();
  });

  it('아이템 클릭 시 toggleDislike이 호출된다', () => {
    render(<PreferencesModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('롱패딩'));
    expect(mockToggleDislike).toHaveBeenCalledWith('outer-long-puffer');
  });

  it('초기화 버튼 클릭 시 clearAllDislikes가 호출된다', () => {
    render(<PreferencesModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByText('초기화'));
    expect(mockClearAllDislikes).toHaveBeenCalled();
  });

  it('닫기 버튼 클릭 시 onClose가 호출된다', () => {
    render(<PreferencesModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByLabelText('닫기'));
    expect(onClose).toHaveBeenCalled();
  });

  it('배경 클릭 시 onClose가 호출된다', () => {
    render(<PreferencesModal isOpen={true} onClose={onClose} />);
    fireEvent.click(screen.getByTestId('modal-backdrop'));
    expect(onClose).toHaveBeenCalled();
  });
});
