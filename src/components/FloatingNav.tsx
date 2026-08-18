import React, { useState, useEffect } from 'react';
import { Scroll, Shield, Users, PenTool, Lock, Settings } from 'lucide-react';

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
        setScrollProgress((window.scrollY / totalScroll) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Proclamation', icon: Shield },
    { id: 'covenant-scroll', label: '12 Articles', icon: Scroll },
    { id: 'keeper', label: 'The Keeper', icon: Shield },
    { id: 'registry', label: 'Member Registry', icon: Users },
    { id: 'sign', label: 'Seal Covenant', icon: PenTool },
    { id: 'privacy', label: 'Privacy', icon: Lock },
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

      {/* Floating Side Dots Navigation (Desktop) */}
      <nav
        className="floating-nav"
        aria-label="Covenant Sections Navigation"
      >
        <div className="flex flex-col items-center gap-3 bg-obsidian/80 backdrop-blur-md p-2 rounded-full border border-imperial-gold/20 shadow-2xl">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? 'bg-imperial-gold text-ink shadow-md shadow-imperial-gold/40'
                    : 'text-imperial-gold/60 hover:text-bright-gold hover:bg-white/5'
                }`}
                aria-label={`Jump to ${item.label}`}
              >
                <Icon className="w-4 h-4" />
                {/* Tooltip on hover */}
                <span className="absolute right-10 whitespace-nowrap bg-obsidian border border-imperial-gold/30 text-ivory text-[10px] font-cinzel tracking-wider px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
                  {item.label}
                </span>
              </button>
            );
          })}

          <div className="w-4 h-px bg-imperial-gold/20 my-1" />

          {/* Admin Dashboard shortcut */}
          <button
            onClick={onOpenAdmin}
            className="group relative w-8 h-8 rounded-full flex items-center justify-center text-imperial-gold/60 hover:text-bright-gold hover:bg-white/5 transition-all cursor-pointer"
            aria-label="Open Admin Registry Dashboard"
          >
            <Settings className="w-4 h-4" />
            <span className="absolute right-10 whitespace-nowrap bg-obsidian border border-imperial-gold/30 text-ivory text-[10px] font-cinzel tracking-wider px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg">
              Admin Registry
            </span>
          </button>
        </div>
      </nav>
    </>
  );
}
