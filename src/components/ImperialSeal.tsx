import React from 'react';

interface ImperialSealProps {
  label?: string;
  subLabel?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'red' | 'gold' | 'jade' | 'pending';
  stamped?: boolean;
  className?: string;
  uniqueSeed?: string;
}

export default function ImperialSeal({
  label = '盟',
  subLabel = 'COVENANT',
  size = 'md',
  variant = 'red',
  stamped = false,
  className = '',
  uniqueSeed,
}: ImperialSealProps) {
  const sizeMap = {
    sm: { dimension: 44, fontSize: 'text-sm', subFontSize: 'text-[7px]' },
    md: { dimension: 72, fontSize: 'text-xl', subFontSize: 'text-[9px]' },
    lg: { dimension: 96, fontSize: 'text-3xl', subFontSize: 'text-[11px]' },
    xl: { dimension: 130, fontSize: 'text-5xl', subFontSize: 'text-[13px]' },
  };

  const { dimension, fontSize, subFontSize } = sizeMap[size];

  // Dynamic seal colors
  const variantStyles = {
    red: {
      outerRing: '#C89B3C',
      innerRing: '#F0D27A',
      background: 'radial-gradient(ellipse at 35% 30%, #B52B21 0%, #7A1717 50%, #4A0A0A 100%)',
      textColor: '#F0D27A',
      shadow: '0 4px 20px rgba(122, 23, 23, 0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
      border: '2px solid #C89B3C',
    },
    gold: {
      outerRing: '#F0D27A',
      innerRing: '#C89B3C',
      background: 'radial-gradient(ellipse at 35% 30%, #F0D27A 0%, #C89B3C 50%, #74532B 100%)',
      textColor: '#12100C',
      shadow: '0 4px 20px rgba(200, 155, 60, 0.6), inset 0 2px 4px rgba(255,255,255,0.4)',
      border: '2px solid #F0D27A',
    },
    jade: {
      outerRing: '#C89B3C',
      innerRing: '#7AB292',
      background: 'radial-gradient(ellipse at 35% 30%, #567A64 0%, #1D3930 60%, #0F201B 100%)',
      textColor: '#F5E8C6',
      shadow: '0 4px 20px rgba(29, 57, 48, 0.6), inset 0 2px 4px rgba(255,255,255,0.2)',
      border: '2px solid #567A64',
    },
    pending: {
      outerRing: '#74532B',
      innerRing: '#4A3B2C',
      background: 'radial-gradient(ellipse at 35% 30%, #2A241C 0%, #171410 60%, #0D0A08 100%)',
      textColor: '#A08D73',
      shadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
      border: '1px dashed #74532B',
    },
  };

  const currentStyle = variantStyles[variant];

  // Optional slight angle derived from uniqueSeed for authenticity
  const rotationAngle = uniqueSeed
    ? (uniqueSeed.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 12) - 6
    : 0;

  return (
    <div
      className={`relative select-none flex items-center justify-center rounded-full transition-transform duration-500 ${
        stamped ? 'seal-stamped' : ''
      } ${className}`}
      style={{
        width: `${dimension}px`,
        height: `${dimension}px`,
        background: currentStyle.background,
        boxShadow: currentStyle.shadow,
        border: currentStyle.border,
        transform: `rotate(${rotationAngle}deg)`,
      }}
      aria-label={`Imperial Seal: ${subLabel}`}
      role="img"
    >
      {/* SVG Decorative concentric rings & ornate corners */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none p-1"
        aria-hidden="true"
      >
        <circle
          cx="50"
          cy="50"
          r="46"
          fill="none"
          stroke={currentStyle.outerRing}
          strokeWidth="1.5"
          opacity="0.8"
        />
        <circle
          cx="50"
          cy="50"
          r="41"
          fill="none"
          stroke={currentStyle.innerRing}
          strokeWidth="0.8"
          strokeDasharray="2,2"
          opacity="0.6"
        />
        <polygon
          points="50,8 92,50 50,92 8,50"
          fill="none"
          stroke={currentStyle.innerRing}
          strokeWidth="0.5"
          opacity="0.4"
        />
        {/* Small corner dots */}
        <circle cx="50" cy="14" r="1.5" fill={currentStyle.outerRing} />
        <circle cx="86" cy="50" r="1.5" fill={currentStyle.outerRing} />
        <circle cx="50" cy="86" r="1.5" fill={currentStyle.outerRing} />
        <circle cx="14" cy="50" r="1.5" fill={currentStyle.outerRing} />
      </svg>

      {/* Center Character and Sublabel */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <span
          className={`font-serif font-bold leading-none select-none tracking-normal ${fontSize}`}
          style={{ color: currentStyle.textColor }}
        >
          {label}
        </span>
        {subLabel && (
          <span
            className={`font-cinzel tracking-widest font-semibold uppercase mt-0.5 opacity-90 ${subFontSize}`}
            style={{ color: currentStyle.textColor }}
          >
            {subLabel}
          </span>
        )}
      </div>
    </div>
  );
}
