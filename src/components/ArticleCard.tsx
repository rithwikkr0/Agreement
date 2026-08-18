import React, { useRef, useState } from 'react';
import type { Article } from '../data/covenant';
import ImperialSeal from './ImperialSeal';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const { ref, isVisible } = useScrollAnimation(0.12);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  return (
    <div
      ref={ref}
      id={`article-${article.number}`}
      className={`article-card my-8 w-full max-w-2xl mx-auto transition-all duration-700 ${
        isVisible ? 'visible' : ''
      }`}
      style={{ transitionDelay: `${(index % 3) * 120}ms` }}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative p-6 sm:p-8 rounded-sm glass-dark imperial-border transition-transform duration-200 ease-out overflow-hidden group"
        style={{
          transform: isHovered
            ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
            : 'none',
        }}
      >
        {/* Subtle background dragon/cloud ornament watermark */}
        <div
          className="absolute -right-8 -bottom-8 w-40 h-40 opacity-5 pointer-events-none transition-opacity duration-500 group-hover:opacity-10"
          aria-hidden="true"
        >
          <svg viewBox="0 0 100 100" fill="#C89B3C">
            <path d="M50 5 C25 5 5 25 5 50 C5 75 25 95 50 95 C75 95 95 75 95 50 C95 25 75 5 50 5 Z M50 15 C69.3 15 85 30.7 85 50 C85 69.3 69.3 85 50 85 C30.7 85 15 69.3 15 50 C15 30.7 30.7 15 50 15 Z" />
            <polygon points="50,20 62,40 85,40 66,55 73,78 50,64 27,78 34,55 15,40 38,40" fill="none" stroke="#C89B3C" strokeWidth="2"/>
          </svg>
        </div>

        {/* Top header row: Roman Numeral & Seal */}
        <div className="flex items-center justify-between mb-4 border-b border-imperial-gold/15 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <span className="font-cinzel text-xs tracking-[0.25em] text-imperial-gold/80 uppercase font-semibold">
                Article {article.romanNumeral}
              </span>
              <span className="text-[10px] text-imperial-gold/40 tracking-wider font-noto">
                {article.subtitle}
              </span>
            </div>
          </div>

          <ImperialSeal
            label={article.sealLabel}
            subLabel={`NO. ${article.romanNumeral}`}
            size="sm"
            variant="red"
            className="group-hover:scale-105 transition-transform"
          />
        </div>

        {/* Article Title */}
        <h3 className="font-cinzel text-xl sm:text-2xl font-bold tracking-wide text-ivory mb-3 group-hover:text-bright-gold transition-colors">
          {article.title}
        </h3>

        {/* Article Text */}
        <p className="font-noto text-sm sm:text-base leading-relaxed text-aged-paper/90 font-light">
          {article.text}
        </p>

        {/* Bottom subtle gold accent line */}
        <div className="mt-5 pt-3 flex items-center justify-between text-[11px] text-imperial-gold/50 font-cinzel tracking-widest border-t border-imperial-gold/10">
          <span>COVENANT CHARTER</span>
          <span>◈ ◈ ◈</span>
          <span>ARTICLE {article.number} OF 12</span>
        </div>
      </div>
    </div>
  );
}
