import { Suspense, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Lazy import Three.js scene
const LazyImperialScene = () => {
  const [Scene, setScene] = useState<React.ComponentType<{ isMobile: boolean }> | null>(null);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const isMobile = window.innerWidth < 768;

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) { setWebglAvailable(false); return; }
    } catch { setWebglAvailable(false); return; }

    import('./ImperialScene').then(mod => setScene(() => mod.default));
  }, []);

  if (!webglAvailable || !Scene) return null;
  return <Scene isMobile={isMobile} />;
};

interface HeroProps {
  onEnter: () => void;
}

export default function Hero({ onEnter }: HeroProps) {
  const reducedMotion = useReducedMotion();
  const [entered, setEntered] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleEnter = () => {
    setEntered(true);
    setTimeout(onEnter, 800);
  };

  return (
    <section
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-ink"
      aria-label="Imperial Covenant — Opening Ceremony"
      id="hero"
    >
      {/* 3D Background */}
      <div
        className="absolute inset-0"
        style={{ transform: reducedMotion ? undefined : `translateY(${scrollY * 0.3}px)` }}
      >
        <Suspense fallback={null}>
          <LazyImperialScene />
        </Suspense>
      </div>

      {/* CSS Fallback Background */}
      <div className="absolute inset-0 bg-ink-bg pointer-events-none" style={{ zIndex: -1 }} />

      {/* Mountain silhouette CSS layers */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden="true">
        {/* Far mountains */}
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="w-full" style={{ height: '30vh', opacity: 0.3 }}>
          <path d="M0,300 L0,220 L80,160 L160,200 L260,100 L360,170 L440,80 L520,140 L620,40 L700,120 L780,60 L880,130 L960,50 L1040,100 L1140,70 L1220,140 L1300,90 L1440,180 L1440,300 Z" fill="#0D0A07"/>
        </svg>
        {/* Mid mountains */}
        <svg viewBox="0 0 1440 250" preserveAspectRatio="none" className="w-full absolute bottom-0" style={{ height: '22vh', opacity: 0.5 }}>
          <path d="M0,250 L0,200 L100,140 L200,180 L320,80 L420,150 L520,60 L640,130 L740,50 L840,120 L940,70 L1040,140 L1140,80 L1240,150 L1340,100 L1440,160 L1440,250 Z" fill="#100C08"/>
        </svg>
        {/* Near mountains */}
        <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full absolute bottom-0" style={{ height: '15vh', opacity: 0.8 }}>
          <path d="M0,200 L0,170 L120,100 L220,150 L340,60 L460,120 L560,40 L680,110 L780,30 L900,100 L1000,50 L1120,120 L1220,60 L1340,130 L1440,90 L1440,200 Z" fill="#12100C"/>
        </svg>
        {/* Ground mist */}
        <div className="absolute bottom-0 left-0 right-0 h-24 mist-layer" />
      </div>

      {/* Decorative floating particles (CSS) */}
      {!reducedMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-imperial-gold"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${8 + Math.random() * 12}s`,
                animationDelay: `${Math.random() * 8}s`,
                '--drift': `${(Math.random() - 0.5) * 60}px`,
                opacity: 0.3 + Math.random() * 0.4,
                animation: `particleDrift ${8 + Math.random() * 12}s ease-in-out ${Math.random() * 8}s infinite`,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Content */}
      <div
        className={`relative z-10 flex flex-col items-center text-center px-6 transition-all duration-700 ${
          entered ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Ornamental symbol */}
        <div
          className="mb-8 text-imperial-gold text-2xl animate-float"
          aria-hidden="true"
          style={{ animationDuration: '4s' }}
        >
          ◈
        </div>

        {/* Decorative top line */}
        <div className="flex items-center gap-4 mb-6" aria-hidden="true">
          <div className="h-px w-16 md:w-32 bg-gradient-to-r from-transparent to-imperial-gold opacity-60" />
          <span className="text-imperial-gold text-xs font-cinzel tracking-[0.3em] opacity-60">
            ANNO DOMINI
          </span>
          <div className="h-px w-16 md:w-32 bg-gradient-to-l from-transparent to-imperial-gold opacity-60" />
        </div>

        {/* Main title */}
        <h1 className="font-cinzel-deco text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none mb-4">
          <span className="gold-text hero-title-glow block">THE IMPERIAL</span>
          <span className="gold-text hero-title-glow block">COVENANT</span>
        </h1>

        {/* Subtitle */}
        <p className="font-cinzel text-xs md:text-sm tracking-[0.4em] text-imperial-gold/70 mb-10 uppercase">
          Team &nbsp;·&nbsp; Discipline &nbsp;·&nbsp; Trust
        </p>

        {/* Decorative divider */}
        <div className="flex items-center gap-3 mb-10" aria-hidden="true">
          <div className="h-px w-12 bg-imperial-gold/30" />
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="opacity-40">
            <path d="M10 2L12 8H18L13 12L15 18L10 14L5 18L7 12L2 8H8L10 2Z" fill="#C89B3C"/>
          </svg>
          <div className="h-px w-12 bg-imperial-gold/30" />
        </div>

        {/* Enter button */}
        <button
          id="enter-covenant-btn"
          onClick={handleEnter}
          className="btn-imperial px-8 py-4 text-sm font-cinzel tracking-[0.2em] rounded-sm cursor-pointer disabled:opacity-50"
          aria-label="Enter the Imperial Covenant"
        >
          ◈ &nbsp;ENTER THE COVENANT&nbsp; ◈
        </button>

        {/* Scroll hint */}
        <div className="mt-12 flex flex-col items-center gap-2 opacity-40 animate-float" style={{ animationDuration: '3s' }}>
          <div className="w-px h-8 bg-imperial-gold/50" />
          <span className="font-cinzel text-xs tracking-[0.3em] text-imperial-gold">SCROLL</span>
        </div>
      </div>

      {/* Corner ornaments */}
      {['top-6 left-6', 'top-6 right-6', 'bottom-6 left-6', 'bottom-6 right-6'].map((pos, i) => (
        <div
          key={i}
          className={`absolute ${pos} w-8 h-8 opacity-30`}
          aria-hidden="true"
          style={{
            borderTop: i < 2 ? '1px solid #C89B3C' : undefined,
            borderBottom: i >= 2 ? '1px solid #C89B3C' : undefined,
            borderLeft: i % 2 === 0 ? '1px solid #C89B3C' : undefined,
            borderRight: i % 2 === 1 ? '1px solid #C89B3C' : undefined,
          }}
        />
      ))}
    </section>
  );
}
