import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import LeaderSection from './components/LeaderSection';
import ScrollDocument from './components/ScrollDocument';
import TeamRegistry from './components/TeamRegistry';
import SigningSection from './components/SigningSection';
import FinalCeremony from './components/FinalCeremony';
import AdminDashboard from './components/AdminDashboard';
import FloatingNav from './components/FloatingNav';
import PrivacyNotice from './components/PrivacyNotice';
import { loadMembers, getMember } from './services/storage';
import type { AgreementData } from './services/agreement';
import { Sparkles, Scroll, Crown, Shield } from 'lucide-react';

export default function App() {
  const [members, setMembers] = useState<AgreementData[]>([]);
  const [viewingMember, setViewingMember] = useState<AgreementData | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 });

  // Load saved members on mount
  useEffect(() => {
    refreshMembers();

    // Check if covenant_id query parameter is present in URL
    try {
      const params = new URLSearchParams(window.location.search);
      const covenantId = params.get('covenant_id');
      if (covenantId) {
        const found = getMember(covenantId);
        if (found) {
          setViewingMember(found);
        }
      }
    } catch {}
  }, []);

  // Desktop subtle gold cursor glow tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ['hero', 'keeper', 'covenant-scroll', 'registry', 'sign', 'privacy'];
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const refreshMembers = () => {
    const loaded = loadMembers();
    setMembers(loaded);
  };

  const handleNavigate = (sectionId: string) => {
    setViewingMember(null);
    setShowAdmin(false);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleMemberSealed = (newMember: AgreementData) => {
    refreshMembers();
  };

  return (
    <div className="relative min-h-screen bg-ink text-ivory selection:bg-imperial-gold/30 selection:text-bright-gold font-noto">
      {/* Desktop subtle gold cursor glow */}
      <div
        className="cursor-glow pointer-events-none hidden md:block"
        style={{
          left: `${cursorPos.x}px`,
          top: `${cursorPos.y}px`,
        }}
        aria-hidden="true"
      />

      {/* Floating navigation dock */}
      {!showAdmin && !viewingMember && (
        <FloatingNav
          onNavigate={handleNavigate}
          onOpenAdmin={() => setShowAdmin(true)}
          activeSection={activeSection}
        />
      )}

      {/* Top Banner & Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-obsidian/85 backdrop-blur-md border-b border-imperial-gold/20 px-4 py-3 flex items-center justify-between shadow-2xl">
        <button
          type="button"
          onClick={() => handleNavigate('hero')}
          className="flex items-center gap-2.5 cursor-pointer group text-left"
        >
          <div className="w-7 h-7 rounded-full bg-ancient-red border border-imperial-gold flex items-center justify-center text-bright-gold text-xs font-serif shadow-md group-hover:scale-105 transition-transform">
            盟
          </div>
          <div>
            <span className="font-cinzel text-xs sm:text-sm font-bold tracking-widest text-ivory group-hover:text-bright-gold transition-colors block">
              THE IMPERIAL COVENANT
            </span>
            <span className="text-[9px] font-cinzel text-imperial-gold/50 tracking-wider hidden sm:block">
              CHARTER OF RESPONSIBILITY & TRUST
            </span>
          </div>
        </button>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => handleNavigate('sign')}
            className="btn-vermilion px-3.5 py-1.5 rounded text-[11px] font-cinzel font-bold tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEAL OATH</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAdmin(!showAdmin)}
            className="px-3 py-1.5 rounded bg-black/50 text-aged-paper hover:text-ivory border border-imperial-gold/30 text-[11px] font-cinzel tracking-wider transition-colors cursor-pointer"
          >
            {showAdmin ? 'VIEW CHARTER' : 'ADMIN REGISTRY'}
          </button>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="pt-12">
        {showAdmin ? (
          /* Admin / Member Registry Manager View */
          <AdminDashboard
            members={members}
            onBack={() => setShowAdmin(false)}
            onRefreshData={refreshMembers}
            onViewMember={(member) => {
              setShowAdmin(false);
              setViewingMember(member);
            }}
          />
        ) : viewingMember ? (
          /* Specific Member Sealed Record View */
          <div className="py-16">
            <FinalCeremony
              member={viewingMember}
              onResetToNew={() => setViewingMember(null)}
            />
          </div>
        ) : (
          /* Full Ceremonial Document Flow */
          <>
            {/* 1. Opening Proclamation Hero */}
            <Hero onEnter={() => handleNavigate('keeper')} />

            {/* 2. The Keeper of the Covenant (Leadership & Purpose) */}
            <LeaderSection />

            {/* 3. The Twelve Articles in Silk Scroll Parchment */}
            <ScrollDocument onScrollToSign={() => handleNavigate('sign')} />

            {/* 4. Covenant Member Roll of Honour (4-10 slots) */}
            <TeamRegistry
              members={members}
              onSelectMember={(member) => setViewingMember(member)}
            />

            {/* 5. Ritual Signing Ceremony (5-Step Inscription) */}
            <SigningSection onMemberSealed={handleMemberSealed} />

            {/* 6. Privacy & Security Charter */}
            <PrivacyNotice />
          </>
        )}
      </main>
    </div>
  );
}
