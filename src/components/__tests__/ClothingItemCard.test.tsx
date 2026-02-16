import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ClothingItemCard } from '../ClothingItemCard';
import type { ClothingItem } from '@/types/outfit';

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

  it('카테고리 이모지를 표시한다', () => {
    render(<ClothingItemCard item={mockItem} />);
    expect(screen.getByText('🧥')).toBeInTheDocument();
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
});
