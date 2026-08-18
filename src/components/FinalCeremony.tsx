import React, { useEffect, useState } from 'react';
import type { AgreementData } from '../services/agreement';
import ImperialSeal from './ImperialSeal';
import SharePanel from './SharePanel';
import { formatImperialDate, formatImperialTime } from '../services/agreement';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

interface FinalCeremonyProps {
  member: AgreementData;
  onResetToNew?: () => void;
}

export default function FinalCeremony({ member, onResetToNew }: FinalCeremonyProps) {
  const [particles, setParticles] = useState<{ id: number; tx: number; ty: number; duration: number }[]>([]);

  useEffect(() => {
    // Generate celebratory golden particle burst
    const newParticles = Array.from({ length: 40 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 40;
      const velocity = 80 + Math.random() * 180;
      return {
        id: i,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        duration: 0.8 + Math.random() * 0.8,
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto px-4 py-8 flex flex-col items-center text-center">
      {/* Golden Particle Burst Effect */}
      <div className="particle-burst" aria-hidden="true">
        {particles.map(p => (
          <div
            key={p.id}
            className="burst-particle"
            style={{
              '--tx': `${p.tx}px`,
              '--ty': `${p.ty}px`,
              '--duration': `${p.duration}s`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Main Final Document Card */}
      <div className="relative w-full p-8 sm:p-10 rounded-sm glass-dark imperial-border shadow-2xl overflow-hidden animate-fade-up">
        {/* Top Decorative Border Badge */}
        <div className="flex items-center justify-center gap-2 text-jade font-cinzel text-xs font-bold tracking-[0.25em] uppercase mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>OFFICIAL IMPERIAL RECORD</span>
          <ShieldCheck className="w-4 h-4" />
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-bright-gold tracking-widest mb-6">
          COVENANT SEALED
        </h2>

        {/* Big Wax Stamped Seal */}
        <div className="my-6 flex justify-center">
          <ImperialSeal
            label="印"
            subLabel="AGREED"
            size="xl"
            variant="red"
            stamped={true}
            uniqueSeed={member.memberName}
          />
        </div>

        {/* Member Name */}
        <div className="mt-4 mb-2">
          <span className="text-[11px] font-cinzel text-imperial-gold/60 uppercase tracking-widest block">
            INDELIBLE SIGNATORY
          </span>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-bold text-ivory tracking-wide">
            {member.memberName}
          </h3>
          <p className="text-xs text-bright-gold/80 font-noto mt-0.5">
            {member.role || 'Covenant Member'}
          </p>
        </div>

        {/* Information Table / Record */}
        <div className="my-6 p-4 rounded bg-black/40 border border-imperial-gold/20 text-xs font-cinzel space-y-2">
          <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
            <span className="text-imperial-gold/70">AGREEMENT ID</span>
            <span className="font-mono text-bright-gold font-bold">{member.agreementId}</span>
          </div>
          <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
            <span className="text-imperial-gold/70">DATE OF OATH</span>
            <span className="text-ivory">{formatImperialDate(member.timestamp)}</span>
          </div>
          <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
            <span className="text-imperial-gold/70">TIME OF SEAL</span>
            <span className="text-ivory">{formatImperialTime(member.timestamp)}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-imperial-gold/70">STATUS</span>
            <span className="text-jade font-bold tracking-widest">SEALED & AGREED</span>
          </div>
        </div>

        {/* Photo / Signature preview in miniature */}
        <div className="flex items-center justify-center gap-4 my-6">
          {member.photoDataUrl && (
            <div className="text-center">
              <span className="text-[9px] font-cinzel text-imperial-gold/60 block mb-1">PORTRAIT</span>
              <img
                src={member.photoDataUrl}
                alt="Portrait"
                className="w-16 h-16 object-cover rounded border border-imperial-gold/40 mx-auto"
              />
            </div>
          )}
          {member.signatureDataUrl && (
            <div className="text-center">
              <span className="text-[9px] font-cinzel text-imperial-gold/60 block mb-1">SIGNATURE</span>
              <div className="w-28 h-16 bg-[#F2E4C0] rounded border border-imperial-gold/40 flex items-center justify-center p-1">
                <img
                  src={member.signatureDataUrl}
                  alt="Signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </div>
          )}
        </div>

        {/* Disclaimer */}
        <p className="text-[10px] text-aged-paper/50 font-noto italic max-w-xs mx-auto mb-2">
          "This is an internal team working charter and is not a substitute for a legal agreement."
        </p>
      </div>

      {/* Share and PDF Export Panel */}
      <SharePanel member={member} />

      {/* Sign another member button */}
      {onResetToNew && (
        <button
          onClick={onResetToNew}
          className="mt-8 text-xs font-cinzel text-imperial-gold/70 hover:text-bright-gold flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Sign for Another Member</span>
        </button>
      )}
    </div>
  );
}
