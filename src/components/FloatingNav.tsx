import React, { useState, useEffect } from 'react';
import { Scroll, Shield, Users, PenTool, Lock, Settings, Crown } from 'lucide-react';

interface FloatingNavProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
  activeSection: string;
}

export default function FloatingNav({
  onNavigate,
  onOpenAdmin,
  activeSection,
}: FloatingNavProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        setScrollProgress(Math.min(100, Math.max(0, (window.scrollY / totalScroll) * 100)));
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Imperial Proclamation', icon: Shield },
    { id: 'keeper', label: 'The Keeper', icon: Crown },
    { id: 'covenant-scroll', label: '12 Articles Scroll', icon: Scroll },
    { id: 'registry', label: 'Member Registry', icon: Users },
    { id: 'sign', label: 'Seal Covenant', icon: PenTool },
    { id: 'privacy', label: 'Privacy Charter', icon: Lock },
  ];

  return (
    <>
      {/* Scroll Progress Bar (Top) */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-obsidian z-50 pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-ancient-red via-imperial-gold to-bright-gold transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Side Dock (Desktop) */}
      <nav
        className="floating-nav"
        aria-label="Covenant Sections Navigation"
      >
        <div className="flex flex-col items-center gap-3 bg-obsidian/85 backdrop-blur-md p-2 rounded-full border border-imperial-gold/25 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`group relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-imperial-gold text-ink shadow-lg shadow-imperial-gold/50 scale-110'
                    : 'text-imperial-gold/60 hover:text-bright-gold hover:bg-white/5'
                }`}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon className="w-4 h-4" />
                {/* Tooltip on hover */}
                <span className="absolute right-10 whitespace-nowrap bg-obsidian border border-imperial-gold/40 text-ivory text-[10px] font-cinzel tracking-wider px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="w-4 h-px bg-imperial-gold/25 my-0.5" />

          {/* Admin Dashboard shortcut */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="group relative w-8 h-8 rounded-full flex items-center justify-center text-imperial-gold/60 hover:text-bright-gold hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Open Admin Registry Dashboard"
          >
            <Settings className="w-4 h-4" />
            <span className="absolute right-10 whitespace-nowrap bg-obsidian border border-imperial-gold/40 text-ivory text-[10px] font-cinzel tracking-wider px-2.5 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
              Registry Admin
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
