import React, { useState } from 'react';
import { articles } from '../data/covenant';
import ArticleCard from './ArticleCard';
import ImperialSeal from './ImperialSeal';
import { ChevronDown, Sparkles } from 'lucide-react';

interface ScrollDocumentProps {
  onScrollToSign: () => void;
}

export default function ScrollDocument({ onScrollToSign }: ScrollDocumentProps) {
  const [isUnfurled, setIsUnfurled] = useState(true);

  return (
    <section
      id="covenant-scroll"
      className="relative w-full max-w-4xl mx-auto px-4 py-16 sm:py-24"
      aria-label="The Imperial Covenant Scroll"
    >
      {/* Scroll Header Description */}
      <div className="text-center mb-12 animate-on-scroll in-view">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="h-px w-12 bg-imperial-gold/40" />
          <span className="font-cinzel text-xs tracking-[0.3em] text-imperial-gold uppercase">
            Imperial Decree
          </span>
          <div className="h-px w-12 bg-imperial-gold/40" />
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl md:text-5xl font-black text-ivory tracking-wide mb-3">
          THE TWELVE ARTICLES
        </h2>
        <p className="font-noto text-sm text-aged-paper/70 max-w-lg mx-auto italic">
          "Let all who affix their seal to this decree pledge their mind, labour, and honour to the fellowship."
        </p>
      </div>

      {/* ── THE SCROLL CONTAINER ── */}
      <div className="relative mx-auto" style={{ width: 'var(--scroll-width)' }}>
        {/* Top Scroll Rod */}
        <div className="scroll-rod h-8 w-[104%] -ml-[2%] flex items-center justify-between px-4 z-20 relative border border-imperial-gold/40">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-bright-gold to-bronze border border-imperial-gold shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-ancient-red" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-bright-gold/90 font-bold">
              ◈ IMPERIAL CHARTER DECREE ◈
            </span>
          </div>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-bright-gold to-bronze border border-imperial-gold shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-ancient-red" />
          </div>
        </div>

        {/* Parchment Body */}
        <div
          className={`parchment-surface border-x-4 border-bronze/60 px-6 sm:px-12 py-10 shadow-2xl relative transition-all duration-1000 ${
            isUnfurled ? 'opacity-100' : 'opacity-80'
          }`}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 0 60px rgba(116, 83, 43, 0.25)',
          }}
        >
          {/* Scroll Header Seal and Intro */}
          <div className="text-center pb-8 mb-6 border-b-2 border-bronze/30 relative">
            <div className="flex justify-center mb-4">
              <ImperialSeal label="盟" subLabel="IMPERIAL DECREE" size="lg" variant="red" />
            </div>

            <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-ink tracking-wider mb-2">
              THE IMPERIAL COVENANT
            </h3>
            <p className="font-cinzel text-xs font-semibold tracking-[0.25em] text-bronze uppercase mb-4">
              A Formal Charter of Teamwork, Responsibility & Trust
            </p>

            <div className="max-w-xl mx-auto text-ink/80 text-xs sm:text-sm font-noto leading-relaxed bg-black/5 p-4 rounded border border-bronze/20">
              <p>
                We, the undersigned members, enter into this Covenant freely and in good faith. 
                By our common understanding and shared ambition, we establish these twelve articles 
                as the unyielding pillars of our team collaboration.
              </p>
            </div>
          </div>

          {/* List of 12 Articles */}
          <div className="space-y-4">
            {articles.map((article, idx) => (
              <ArticleCard key={article.number} article={article} index={idx} />
            ))}
          </div>

          {/* Scroll Footer Oath Prompt */}
          <div className="mt-12 pt-8 border-t-2 border-bronze/30 text-center">
            <div className="flex items-center justify-center gap-2 text-vermilion font-cinzel text-xs font-bold tracking-widest uppercase mb-4">
              <Sparkles className="w-4 h-4" />
              <span>THE ARTICLES HAVE BEEN READ IN FULL</span>
              <Sparkles className="w-4 h-4" />
            </div>

            <p className="font-noto text-xs sm:text-sm text-ink/80 max-w-md mx-auto mb-6">
              Now proceed to the sacred registry to affix your name, indelible signature, and identity seal.
            </p>

            <button
              onClick={onScrollToSign}
              className="btn-vermilion px-8 py-3.5 text-xs sm:text-sm font-cinzel tracking-widest font-bold rounded-sm shadow-xl hover:shadow-2xl transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <span>PROCEED TO SIGNING CEREMONY</span>
              <ChevronDown className="w-4 h-4 animate-bounce" />
            </button>
          </div>
        </div>

        {/* Bottom Scroll Rod */}
        <div className="scroll-rod h-8 w-[104%] -ml-[2%] flex items-center justify-between px-4 z-20 relative border border-imperial-gold/40">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-bright-gold to-bronze border border-imperial-gold shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-ancient-red" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-cinzel text-[10px] tracking-[0.3em] text-bright-gold/90 font-bold">
              ◈ SO SHALL IT BE WRITTEN & SEALED ◈
            </span>
          </div>
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-bright-gold to-bronze border border-imperial-gold shadow-md flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-ancient-red" />
          </div>
        </div>
      </div>
    </section>
  );
}
