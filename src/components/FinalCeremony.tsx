import React, { useEffect, useState } from 'react';
import type { AgreementData } from '../services/agreement';
import ImperialSeal from './ImperialSeal';
import SharePanel from './SharePanel';
import { formatImperialDate, formatImperialTime } from '../services/agreement';
import { ShieldCheck, ArrowLeft, Award, Lock } from 'lucide-react';
import { countSealed } from '../services/storage';
import { teamConfig } from '../config/team';

interface FinalCeremonyProps {
  member: AgreementData;
  onResetToNew?: () => void;
}

export default function FinalCeremony({ member, onResetToNew }: FinalCeremonyProps) {
  const [particles, setParticles] = useState<{ id: number; tx: number; ty: number; duration: number }[]>([]);
  const sealedTotal = countSealed();
  const maxMembers = teamConfig.maximumMembers || 10;
  const isFull = sealedTotal >= maxMembers;

  useEffect(() => {
    // Generate celebratory golden particle burst
    const newParticles = Array.from({ length: 45 }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / 45;
      const velocity = 90 + Math.random() * 200;
      return {
        id: i,
        tx: Math.cos(angle) * velocity,
        ty: Math.sin(angle) * velocity,
        duration: 0.9 + Math.random() * 0.9,
      };
    });
    setParticles(newParticles);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 py-8 flex flex-col items-center text-center">
      {/* Golden Particle Burst Effect */}
      <div className="particle-burst pointer-events-none" aria-hidden="true">
        {particles.map((p) => (
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
      <div className="relative w-full p-8 sm:p-12 rounded-sm glass-dark imperial-border shadow-2xl overflow-hidden animate-fade-up">
        {/* Top Decorative Border Badge */}
        <div className="flex items-center justify-center gap-2 text-jade font-cinzel text-xs font-bold tracking-[0.25em] uppercase mb-4">
          <ShieldCheck className="w-4 h-4" />
          <span>OFFICIAL IMPERIAL RECORD SEALED</span>
          <ShieldCheck className="w-4 h-4" />
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-3xl sm:text-4xl font-black text-bright-gold tracking-widest mb-4">
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
        <div className="mt-4 mb-3">
          <span className="text-[11px] font-cinzel text-imperial-gold/70 uppercase tracking-widest block">
            INDELIBLE SIGNATORY
          </span>
          <h3 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-ivory tracking-wide mt-1">
            {member.memberName}
          </h3>
          <p className="text-xs text-bright-gold font-noto mt-1 font-semibold">
            {member.role || 'Covenant Member'}
          </p>
        </div>

        {/* Information Table / Record */}
        <div className="my-6 p-5 rounded bg-black/50 border border-imperial-gold/20 text-xs font-cinzel space-y-2.5 text-left">
          <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
            <span className="text-imperial-gold/80">AGREEMENT ID</span>
            <span className="font-mono text-bright-gold font-bold">{member.agreementId}</span>
          </div>
          <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
            <span className="text-imperial-gold/80">OATH DATE</span>
            <span className="text-ivory">{formatImperialDate(member.timestamp)}</span>
          </div>
          <div className="flex justify-between border-b border-imperial-gold/10 pb-2">
            <span className="text-imperial-gold/80">SEAL TIME</span>
            <span className="text-ivory">{formatImperialTime(member.timestamp)}</span>
          </div>
          <div className="flex justify-between pt-1">
            <span className="text-imperial-gold/80">STATUS</span>
            <span className="text-jade font-bold tracking-widest flex items-center gap-1">
              <Award className="w-3.5 h-3.5" /> COVENANT SEALED & AGREED
            </span>
          </div>
        </div>

        {/* Signature & Portrait Dual Verification Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          {/* Signature Box */}
          <div className="p-3 bg-black/40 rounded border border-imperial-gold/30 flex flex-col items-center justify-between min-h-[110px]">
            <span className="text-[10px] font-cinzel text-imperial-gold/80 block mb-1 font-bold">
              INDELIBLE SIGNATURE
            </span>
            {member.signatureDataUrl ? (
              <div className="w-full h-16 bg-[#F2E4C0] rounded border border-bronze/40 flex items-center justify-center p-1 overflow-hidden">
                <img
                  src={member.signatureDataUrl}
                  alt="Member Signature"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <span className="text-xs text-aged-paper/50 font-noto italic my-auto">
                [ Signature on Record ]
              </span>
            )}
            <span className="text-[9px] text-aged-paper/60 font-noto mt-1">
              Signed: {member.memberName}
            </span>
          </div>

          {/* Photo Box */}
          <div className="p-3 bg-black/40 rounded border border-imperial-gold/30 flex flex-col items-center justify-between min-h-[110px]">
            <span className="text-[10px] font-cinzel text-imperial-gold/80 block mb-1 font-bold">
              IDENTITY PORTRAIT SEAL
            </span>
            {member.photoDataUrl ? (
              <div className="w-16 h-16 rounded overflow-hidden border border-imperial-gold/50 shadow-md">
                <img
                  src={member.photoDataUrl}
                  alt="Member Portrait"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded bg-obsidian border border-dashed border-imperial-gold/30 flex items-center justify-center text-[10px] text-aged-paper/40">
                Verified
              </div>
            )}
            <span className="text-[9px] text-aged-paper/60 font-noto mt-1">
              Identity Verified
            </span>
          </div>
        </div>

        {/* Charter Disclaimer */}
        <p className="text-[10px] text-aged-paper/50 font-noto italic max-w-sm mx-auto mb-1">
          "This is an internal team working charter and is not a substitute for a legal agreement."
        </p>
      </div>

      {/* Share and PDF Export Panel */}
      <SharePanel member={member} />

      {/* Sign another member button */}
      {onResetToNew && (
        <div className="mt-8 flex flex-col items-center gap-2">
          {isFull ? (
            <div className="text-xs font-cinzel text-aged-paper/60 flex items-center gap-1.5 bg-black/40 px-4 py-2 rounded border border-white/10">
              <Lock className="w-3.5 h-3.5 text-bright-gold" />
              <span>Covenant Registry Full ({sealedTotal}/{maxMembers} Sealed)</span>
            </div>
          ) : (
            <button
              type="button"
              onClick={onResetToNew}
              className="text-xs font-cinzel text-imperial-gold/80 hover:text-bright-gold flex items-center gap-1.5 transition-colors cursor-pointer bg-black/40 px-5 py-2 rounded border border-imperial-gold/30 hover:border-imperial-gold"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Inscribe Another Member Oath ({sealedTotal}/{maxMembers} Sealed)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
