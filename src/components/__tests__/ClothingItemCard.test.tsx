import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ClothingItemCard } from '../ClothingItemCard';
import type { ClothingItem } from '@/types/outfit';

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

const mockItem: ClothingItem = {
  id: 'outer-padding',
  name: '패딩',
  nameEn: 'Puffer Jacket',
  category: 'OUTER',
  imageUrl: '/assets/clothing/outer/puffer.webp',
  tempLevels: ['FREEZING', 'COLD'],
  tags: ['방한', '캐주얼'],
};

describe('ClothingItemCard', () => {
  it('아이템 이름을 표시한다', () => {
    render(<ClothingItemCard item={mockItem} />);
    expect(screen.getByText('패딩')).toBeInTheDocument();
  });

  it('카테고리 아이콘(SVG)을 표시한다', () => {
    const { container } = render(<ClothingItemCard item={mockItem} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('null 아이템이면 렌더하지 않는다', () => {
    const { container } = render(<ClothingItemCard item={null} />);
    expect(container.innerHTML).toBe('');
  });

  it('추가 className을 전달할 수 있다', () => {
    render(<ClothingItemCard item={mockItem} className="test-class" />);
    const card = screen.getByText('패딩').closest('div');
    expect(card?.parentElement?.className).toContain('test-class');
  });

  it('카테고리 라벨을 표시한다', () => {
    render(<ClothingItemCard item={mockItem} />);
    expect(screen.getByText('아우터')).toBeInTheDocument();
  });

  it('onClick이 전달되면 클릭 시 호출된다', () => {
    const onClick = vi.fn();
    render(<ClothingItemCard item={mockItem} onClick={onClick} />);
    fireEvent.click(screen.getByText('패딩'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('onClick이 전달되면 button role을 가진다', () => {
    render(<ClothingItemCard item={mockItem} onClick={() => {}} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});
