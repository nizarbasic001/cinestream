import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '@/types';
import { MovieCard } from './MovieCard';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '@/i18n';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { dir } = useI18n();

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    const delta = direction === 'left' ? -amount : amount;
    scrollRef.current.scrollBy({ left: dir === 'rtl' ? -delta : delta, behavior: 'smooth' });
  };

  if (movies.length === 0) return null;

  return (
    <section className="relative group/row mb-8 md:mb-10">
      <div className="flex items-center justify-between px-4 md:px-8 lg:px-12 mb-3">
        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-cs-text">{title}</h2>
      </div>

      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute start-0 top-0 bottom-0 z-10 w-12 md:w-14 bg-gradient-to-r from-cs-bg via-cs-bg/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar px-4 md:px-8 lg:px-12 scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => navigate(`/movie/${movie.id}`)}
            />
          ))}
        </div>

        <button
          onClick={() => scroll('right')}
          className="absolute end-0 top-0 bottom-0 z-10 w-12 md:w-14 bg-gradient-to-l from-cs-bg via-cs-bg/80 to-transparent flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-opacity duration-300"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>
    </section>
  );
}
