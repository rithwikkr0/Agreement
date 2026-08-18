import React from 'react';
import { teamConfig } from '../config/team';
import ImperialSeal from './ImperialSeal';
import { Crown, Shield, Users, Clock, Award } from 'lucide-react';

export default function LeaderSection() {
  return (
    <section
      id="keeper"
      className="relative w-full max-w-4xl mx-auto px-4 py-16"
      aria-label="The Keeper of the Covenant"
    >
      <div className="relative glass-dark imperial-border p-8 sm:p-12 rounded-sm overflow-hidden text-center">
        {/* Decorative corner trims */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-imperial-gold" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-imperial-gold" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-imperial-gold" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-imperial-gold" />

        {/* Section Pill / Subtitle */}
        <div className="flex items-center justify-center gap-2 mb-4 text-imperial-gold">
          <Crown className="w-5 h-5 text-bright-gold" />
          <span className="font-cinzel text-xs font-bold tracking-[0.3em] uppercase">
            Leadership & Governance
          </span>
          <Crown className="w-5 h-5 text-bright-gold" />
        </div>

        {/* Title */}
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-ivory tracking-wide mb-2">
          THE KEEPER OF THE COVENANT
        </h2>
        <p className="font-noto text-xs sm:text-sm text-aged-paper/70 mb-8 max-w-lg mx-auto italic">
          "A steward of the team's shared vision, dedicated to fair coordination, mutual respect, and high standards."
        </p>

        {/* Royal Seal and Leader Badge */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative mb-4">
            <ImperialSeal
              label="主"
              subLabel="LEADER"
              size="lg"
              variant="gold"
              className="shadow-2xl"
            />
          </div>

          <div className="inline-block bg-black/40 px-6 py-2 rounded border border-imperial-gold/30">
            <span className="font-cinzel text-xs tracking-widest text-imperial-gold block">
              COVENANT LEADER
            </span>
            <span className="font-cinzel text-xl sm:text-2xl font-bold text-bright-gold tracking-wide">
              {teamConfig.leaderName || 'Team Leader'}
            </span>
          </div>
        </div>

        {/* Authority Statement */}
        <div className="max-w-2xl mx-auto mb-10 p-5 bg-imperial-gold/5 rounded border border-imperial-gold/20 text-aged-paper text-sm font-noto leading-relaxed">
          <p className="italic">
            "{teamConfig.leaderAuthority}"
          </p>
        </div>

        {/* Core Pillars of Leadership */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 bg-obsidian/70 rounded border border-imperial-gold/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-imperial-gold">
              <Users className="w-4 h-4" />
              <span className="font-cinzel text-xs font-bold">Role Assignment</span>
            </div>
            <p className="text-[12px] text-aged-paper/70 font-noto">
              Assigns and reallocates project roles to match individual strengths and project needs.
            </p>
          </div>

          <div className="p-4 bg-obsidian/70 rounded border border-imperial-gold/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-imperial-gold">
              <Clock className="w-4 h-4" />
              <span className="font-cinzel text-xs font-bold">Deadlines</span>
            </div>
            <p className="text-[12px] text-aged-paper/70 font-noto">
              Coordinates project milestones, resolves bottlenecks, and ensures timely delivery.
            </p>
          </div>

          <div className="p-4 bg-obsidian/70 rounded border border-imperial-gold/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-imperial-gold">
              <Shield className="w-4 h-4" />
              <span className="font-cinzel text-xs font-bold">Integrity</span>
            </div>
            <p className="text-[12px] text-aged-paper/70 font-noto">
              Maintains professional ethics, protects psychological safety, and enforces fairness.
            </p>
          </div>

          <div className="p-4 bg-obsidian/70 rounded border border-imperial-gold/15 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-imperial-gold">
              <Award className="w-4 h-4" />
              <span className="font-cinzel text-xs font-bold">Quality Review</span>
            </div>
            <p className="text-[12px] text-aged-paper/70 font-noto">
              Reviews deliverables to guarantee standard compliance before final submissions.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
