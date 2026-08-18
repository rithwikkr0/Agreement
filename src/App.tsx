import React, { useState, useEffect } from 'react';
import Hero from './components/Hero';
import ScrollDocument from './components/ScrollDocument';
import LeaderSection from './components/LeaderSection';
import TeamRegistry from './components/TeamRegistry';
import SigningSection from './components/SigningSection';
import FinalCeremony from './components/FinalCeremony';
import AdminDashboard from './components/AdminDashboard';
import FloatingNav from './components/FloatingNav';
import PrivacyNotice from './components/PrivacyNotice';
import { loadMembers } from './services/storage';
import type { AgreementData } from './services/agreement';
import { teamConfig } from './config/team';
import { Shield, Sparkles } from 'lucide-react';

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
    const params = new URLSearchParams(window.location.search);
    const covenantId = params.get('covenant_id');
    if (covenantId) {
      const allMembers = loadMembers();
      const match = allMembers.find((m) => m.agreementId === covenantId);
      if (match) {
        setViewingMember(match);
      }
    }
  }, []);

  // Desktop cursor glow tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Track active section on scroll
  useEffect(() => {
    const sections = ['hero', 'covenant-scroll', 'keeper', 'registry', 'sign', 'privacy'];
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

      {/* Floating navigation */}
      {!showAdmin && !viewingMember && (
        <FloatingNav
          onNavigate={handleNavigate}
          onOpenAdmin={() => setShowAdmin(true)}
          activeSection={activeSection}
        />
      )}

      {/* Top Banner & Quick Controls */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-obsidian/70 backdrop-blur-md border-b border-imperial-gold/15 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => handleNavigate('hero')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-6 h-6 rounded-full bg-ancient-red border border-imperial-gold flex items-center justify-center text-bright-gold text-xs font-serif">
            盟
          </div>
          <span className="font-cinzel text-xs sm:text-sm font-bold tracking-widest text-ivory group-hover:text-bright-gold transition-colors">
            THE IMPERIAL COVENANT
          </span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavigate('sign')}
            className="btn-vermilion px-3 py-1.5 rounded text-[11px] font-cinzel font-bold tracking-wider flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>SEAL OATH</span>
          </button>

          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="px-3 py-1.5 rounded bg-black/40 text-aged-paper hover:text-ivory border border-imperial-gold/30 text-[11px] font-cinzel tracking-wider transition-colors cursor-pointer"
          >
            {showAdmin ? 'VIEW COVENANT' : 'REGISTRY ADMIN'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-12">
        {showAdmin ? (
          /* Admin / Registry Overview View */
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
          /* Specific Member Sealed View */
          <div className="py-16">
            <FinalCeremony
              member={viewingMember}
              onResetToNew={() => setViewingMember(null)}
            />
          </div>
        ) : (
          /* Full Imperial Covenant Experience */
          <>
            {/* 1. Opening Full-viewport Hero */}
            <Hero onEnter={() => handleNavigate('covenant-scroll')} />

            {/* 2. The 12 Articles in Scroll Parchment */}
            <ScrollDocument onScrollToSign={() => handleNavigate('sign')} />

            {/* 3. The Keeper of the Covenant */}
            <LeaderSection />

            {/* 4. Covenant Member Registry (4-10 slots) */}
            <TeamRegistry
              members={members}
              onSelectMember={(member) => setViewingMember(member)}
            />

            {/* 5. Signing Ceremony (5-Step Form) */}
            <SigningSection onMemberSealed={handleMemberSealed} />

            {/* 6. Privacy charter and Legal Notice */}
            <PrivacyNotice />
          </>
        )}
      </main>
    </div>
  );
}
