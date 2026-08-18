import React from 'react';
import { teamConfig } from '../config/team';
import type { AgreementData } from '../services/agreement';
import ImperialSeal from './ImperialSeal';
import { ShieldCheck, Clock, Users, Eye } from 'lucide-react';
import { formatImperialDate } from '../services/agreement';

interface TeamRegistryProps {
  members: AgreementData[];
  onSelectMember?: (member: AgreementData) => void;
}

export default function TeamRegistry({ members, onSelectMember }: TeamRegistryProps) {
  const maxMembers = teamConfig.maximumMembers || 10;
  const sealedCount = members.filter(m => m.status === 'sealed').length;

  // Build an array of 10 slots
  const memberSlots = Array.from({ length: maxMembers }).map((_, index) => {
    const existing = members[index];
    return {
      slotIndex: index + 1,
      member: existing || null,
    };
  });

  return (
    <section
      id="registry"
      className="relative w-full max-w-5xl mx-auto px-4 py-16"
      aria-label="Covenant Member Registry"
    >
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="h-px w-10 bg-imperial-gold/40" />
          <span className="font-cinzel text-xs tracking-[0.3em] text-imperial-gold uppercase">
            Roll of Honour
          </span>
          <div className="h-px w-10 bg-imperial-gold/40" />
        </div>
        <h2 className="font-cinzel text-3xl sm:text-4xl font-extrabold text-ivory tracking-wide mb-3">
          THE MEMBERS OF THE COVENANT
        </h2>
        <p className="font-noto text-xs sm:text-sm text-aged-paper/70 max-w-lg mx-auto mb-6 italic">
          "Each seal inscribed upon this ledger binds a fellowship of mutual accountability."
        </p>

        {/* Status bar */}
        <div className="inline-flex items-center gap-4 bg-obsidian px-5 py-2.5 rounded-full border border-imperial-gold/20 text-xs font-cinzel tracking-wider">
          <span className="flex items-center gap-1.5 text-bright-gold">
            <Users className="w-3.5 h-3.5" />
            <span>PROGRESS:</span>
            <strong>{sealedCount} / {maxMembers} SEALED</strong>
          </span>
          <span className="text-imperial-gold/40">|</span>
          <span className="text-aged-paper/60">
            MINIMUM REQUIRED: {teamConfig.minimumMembers || 4}
          </span>
        </div>
      </div>

      {/* Grid of Member Registry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {memberSlots.map(({ slotIndex, member }) => {
          const isSealed = member && member.status === 'sealed';
          const formattedIndex = slotIndex.toString().padStart(2, '0');

          return (
            <div
              key={slotIndex}
              className={`relative p-5 rounded-sm glass-dark imperial-border flex flex-col items-center justify-between text-center transition-all duration-300 ${
                isSealed
                  ? 'border-imperial-gold/40 hover:border-imperial-gold shadow-lg hover:shadow-imperial-gold/10'
                  : 'border-white/5 opacity-70'
              }`}
            >
              {/* Member Slot Header */}
              <div className="w-full flex items-center justify-between mb-3 text-[10px] font-cinzel text-imperial-gold/60">
                <span className="font-bold tracking-widest">SLOT {formattedIndex}</span>
                {isSealed ? (
                  <span className="flex items-center gap-1 text-jade font-semibold">
                    <ShieldCheck className="w-3 h-3" /> SEALED
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-aged-paper/40">
                    <Clock className="w-3 h-3" /> PENDING
                  </span>
                )}
              </div>

              {/* Seal Representation */}
              <div className="my-3">
                {isSealed ? (
                  <ImperialSeal
                    label="印"
                    subLabel={`MEMBER ${formattedIndex}`}
                    size="md"
                    variant="red"
                    uniqueSeed={member.memberName}
                  />
                ) : (
                  <ImperialSeal
                    label="空"
                    subLabel="AWAITING"
                    size="md"
                    variant="pending"
                  />
                )}
              </div>

              {/* Member Name and Role */}
              <div className="w-full mt-2">
                <h4 className="font-cinzel text-sm font-bold text-ivory tracking-wide truncate">
                  {isSealed ? member.memberName : `Slot #${formattedIndex}`}
                </h4>
                <p className="text-[11px] text-aged-paper/70 font-noto truncate mt-0.5">
                  {isSealed ? (member.role || 'Fellow Member') : 'Awaiting Oath'}
                </p>
              </div>

              {/* Details and Actions */}
              <div className="w-full mt-4 pt-3 border-t border-imperial-gold/10 text-[10px] font-cinzel text-imperial-gold/60 flex flex-col gap-1">
                {isSealed ? (
                  <>
                    <span className="truncate text-aged-paper/50">{member.agreementId}</span>
                    <span className="text-[9px] text-aged-paper/40">
                      {formatImperialDate(member.timestamp)}
                    </span>
                    {onSelectMember && (
                      <button
                        onClick={() => onSelectMember(member)}
                        className="mt-2 w-full py-1 text-[10px] bg-imperial-gold/10 hover:bg-imperial-gold/20 text-bright-gold rounded border border-imperial-gold/30 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Eye className="w-3 h-3" /> View Record
                      </button>
                    )}
                  </>
                ) : (
                  <span className="text-[10px] text-aged-paper/40 py-2 italic font-noto">
                    Unsigned slot
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
