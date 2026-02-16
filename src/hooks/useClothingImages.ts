import { useState, useEffect, useRef } from 'react';
import type { ClothingImage } from '@/types/image';

interface UseClothingImagesReturn {
  images: ClothingImage[];
  isLoading: boolean;
  error: string | null;
}

/** 의류 아이템 이름으로 이미지 검색 (결과 캐싱) */
export function useClothingImages(itemName: string | null): UseClothingImagesReturn {
  const [images, setImages] = useState<ClothingImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cacheRef = useRef<Map<string, ClothingImage[]>>(new Map());

  useEffect(() => {
    if (!itemName) {
      setImages([]);
      setError(null);
      return;
    }

    // 캐시 확인
    const cached = cacheRef.current.get(itemName);
    if (cached) {
      setImages(cached);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;

    async function fetchImages() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/images?query=${encodeURIComponent(itemName!)}&display=8`,
        );

        if (!res.ok) {
          throw new Error(`API error: ${res.status}`);
        }

        const data = await res.json();

        if (!cancelled) {
          const fetchedImages = data.images as ClothingImage[];
          setImages(fetchedImages);
          setIsLoading(false);
          // 캐시 저장
          cacheRef.current.set(itemName!, fetchedImages);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : '이미지를 가져오는 데 실패했습니다.');
          setIsLoading(false);
        }
      }
    }

    void fetchImages();

    return () => {
      cancelled = true;
    };
  }, [itemName]);

  return { images, isLoading, error };
}
