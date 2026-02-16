'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Navigation, Loader2, MapPin } from 'lucide-react';
import { useCitySearch } from '@/hooks/useCitySearch';
import { countryCodeToFlag } from '@/lib/countryFlag';
import type { CitySearchResult } from '@/types/location';

interface CitySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCity: (city: CitySearchResult) => void;
  onSelectCurrentLocation: () => void;
}

export function CitySearchModal({
  isOpen,
  onClose,
  onSelectCity,
  onSelectCurrentLocation,
}: CitySearchModalProps) {
  const { query, setQuery, results, isSearching, error, clearResults } = useCitySearch();
  const inputRef = useRef<HTMLInputElement>(null);

  // 모달 열릴 때 input 포커스
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      clearResults();
    }
  }, [isOpen, clearResults]);

  // ESC 키로 닫기
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // 스크롤 잠금
  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function handleSelectCity(city: CitySearchResult) {
    onSelectCity(city);
    clearResults();
  }

  function handleCurrentLocation() {
    onSelectCurrentLocation();
    clearResults();
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* 배경 오버레이 */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            data-testid="modal-backdrop"
          />

          {/* 모달 컨텐츠 */}
          <motion.div
            className="relative z-10 flex flex-col max-h-screen mx-auto w-full max-w-lg px-4 pt-12 pb-8"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring' as const, stiffness: 300, damping: 24 }}
          >
            {/* 헤더 */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-white">도시 검색</h2>
              <button
                onClick={onClose}
                aria-label="닫기"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            {/* 검색 입력 */}
            <div className="glass-card flex items-center gap-3 px-4 py-3 mb-4">
              <Search size={18} className="text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="도시 이름을 검색하세요"
                className="flex-1 bg-transparent text-white placeholder-white/30 outline-none text-sm"
                data-testid="city-search-input"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="text-white/40 hover:text-white/70"
                  aria-label="검색어 지우기"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* 현재 위치 사용 버튼 */}
            <button
              onClick={handleCurrentLocation}
              className="glass-card flex items-center gap-3 px-4 py-3 mb-4 w-full text-left transition-colors hover:bg-white/15"
              data-testid="current-location-btn"
            >
              <Navigation size={18} className="text-accent shrink-0" />
              <span className="text-sm font-medium text-white">현재 위치 사용</span>
            </button>

            {/* 결과 목록 */}
            <div className="flex-1 overflow-y-auto space-y-2 scrollbar-hide">
              {isSearching && (
                <div className="flex justify-center py-8">
                  <Loader2 size={24} className="text-white/50 animate-spin" data-testid="search-spinner" />
                </div>
              )}

              {error && (
                <div className="glass-card p-4 text-center">
                  <p className="text-sm text-white/70">{error}</p>
                </div>
              )}

              {!isSearching && !error && query.trim().length >= 2 && results.length === 0 && (
                <div className="glass-card p-4 text-center">
                  <p className="text-sm text-white/70">검색 결과가 없습니다</p>
                </div>
              )}

              {results.map((city, i) => (
                <motion.button
                  key={`${city.latitude}-${city.longitude}`}
                  onClick={() => handleSelectCity(city)}
                  className="glass-card flex items-center gap-3 px-4 py-3 w-full text-left transition-colors hover:bg-white/15"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  data-testid="city-result"
                >
                  <MapPin size={16} className="text-white/40 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {countryCodeToFlag(city.country)} {city.displayName}
                    </p>
                    <p className="text-xs text-white/50 truncate">
                      {[city.state, city.country].filter(Boolean).join(', ')}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
