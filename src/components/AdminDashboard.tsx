import React, { useState } from 'react';
import type { AgreementData } from '../services/agreement';
import { exportMembersJSON, resetAllData } from '../services/storage';
import { generateCovenantPDF } from '../services/pdf';
import { teamConfig } from '../config/team';
import ImperialSeal from './ImperialSeal';
import {
  Download,
  Trash2,
  FileCode,
  ArrowLeft,
  ShieldCheck,
  Clock,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import { formatImperialDate, formatImperialTime } from '../services/agreement';

interface AdminDashboardProps {
  members: AgreementData[];
  onBack: () => void;
  onRefreshData: () => void;
  onViewMember: (member: AgreementData) => void;
}

export default function AdminDashboard({
  members,
  onBack,
  onRefreshData,
  onViewMember,
}: AdminDashboardProps) {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const maxMembers = teamConfig.maximumMembers || 10;
  const sealedCount = members.filter((m) => m.status === 'sealed').length;

  const handleExportJSON = () => {
    const jsonStr = exportMembersJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `covenant-registry-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    onRefreshData();
  };

  // Build rows up to maxMembers
  const slots = Array.from({ length: maxMembers }).map((_, i) => {
    return members[i] || null;
  });

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 py-16">
      {/* Header and Back navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <button
          onClick={onBack}
          className="text-xs font-cinzel text-imperial-gold/80 hover:text-bright-gold flex items-center gap-2 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO THE COVENANT</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center gap-2 text-xs font-cinzel tracking-wider transition-colors cursor-pointer"
          >
            <FileCode className="w-4 h-4 text-bright-gold" />
            <span>EXPORT JSON</span>
          </button>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="px-4 py-2 rounded bg-ancient-red/20 text-vermilion hover:text-white border border-ancient-red/40 hover:border-vermilion flex items-center gap-2 text-xs font-cinzel tracking-wider transition-colors cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>RESET LOCAL DATA</span>
          </button>
        </div>
      </div>

      {/* Main Admin Box */}
      <div className="glass-dark imperial-border p-6 sm:p-10 rounded-sm shadow-2xl">
        <div className="border-b border-imperial-gold/20 pb-6 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="font-cinzel text-xs text-imperial-gold tracking-[0.25em] uppercase font-bold">
              Administrative Overseer
            </span>
            <h2 className="font-cinzel text-2xl sm:text-3xl font-bold text-ivory mt-1">
              TEAM COVENANT REGISTRY
            </h2>
            <p className="text-xs text-aged-paper/70 font-noto mt-1">
              Real-time local status of all member seals and signatures.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-obsidian rounded border border-imperial-gold/30 text-center">
              <span className="text-[10px] font-cinzel text-imperial-gold/60 block">SEALED</span>
              <span className="font-cinzel text-xl font-bold text-jade">{sealedCount}</span>
            </div>
            <div className="px-4 py-2 bg-obsidian rounded border border-imperial-gold/30 text-center">
              <span className="text-[10px] font-cinzel text-imperial-gold/60 block">PENDING</span>
              <span className="font-cinzel text-xl font-bold text-aged-paper/50">
                {maxMembers - sealedCount}
              </span>
            </div>
          </div>
        </div>

        {/* Member Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-cinzel border-collapse">
            <thead>
              <tr className="border-b border-imperial-gold/30 text-imperial-gold/80">
                <th className="py-3 px-3">SLOT</th>
                <th className="py-3 px-3">SEAL</th>
                <th className="py-3 px-3">MEMBER NAME</th>
                <th className="py-3 px-3">ROLE</th>
                <th className="py-3 px-3">AGREEMENT ID</th>
                <th className="py-3 px-3">DATE / TIME</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((member, index) => {
                const formattedSlot = (index + 1).toString().padStart(2, '0');
                const isSealed = member && member.status === 'sealed';

                return (
                  <tr key={index} className="admin-row">
                    <td className="py-4 px-3 font-bold text-imperial-gold/70">
                      {formattedSlot}
                    </td>
                    <td className="py-4 px-3">
                      {isSealed ? (
                        <ImperialSeal
                          label="印"
                          subLabel=""
                          size="sm"
                          variant="red"
                          uniqueSeed={member.memberName}
                        />
                      ) : (
                        <ImperialSeal
                          label="空"
                          subLabel=""
                          size="sm"
                          variant="pending"
                        />
                      )}
                    </td>
                    <td className="py-4 px-3 text-ivory font-bold text-sm">
                      {isSealed ? member.memberName : <span className="text-aged-paper/30 italic">Slot {formattedSlot} (Unassigned)</span>}
                    </td>
                    <td className="py-4 px-3 text-aged-paper/80 font-noto">
                      {isSealed ? member.role || 'Member' : '—'}
                    </td>
                    <td className="py-4 px-3 font-mono text-imperial-gold/80">
                      {isSealed ? member.agreementId : '—'}
                    </td>
                    <td className="py-4 px-3 text-aged-paper/60 font-noto text-[11px]">
                      {isSealed
                        ? `${formatImperialDate(member.timestamp)}`
                        : '—'}
                    </td>
                    <td className="py-4 px-3">
                      {isSealed ? (
                        <span className="inline-flex items-center gap-1 text-jade font-semibold bg-jade/10 px-2 py-0.5 rounded border border-jade/30">
                          <ShieldCheck className="w-3 h-3" /> SEALED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-aged-paper/40 bg-black/30 px-2 py-0.5 rounded border border-white/5">
                          <Clock className="w-3 h-3" /> PENDING
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-right">
                      {isSealed && (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onViewMember(member)}
                            className="p-1.5 rounded bg-imperial-gold/10 hover:bg-imperial-gold/20 text-bright-gold border border-imperial-gold/30 transition-colors cursor-pointer"
                            title="View Member Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => generateCovenantPDF(member)}
                            className="p-1.5 rounded bg-vermilion/20 hover:bg-vermilion/30 text-ivory border border-vermilion/40 transition-colors cursor-pointer"
                            title="Export Member PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="glass-dark imperial-border p-6 sm:p-8 rounded max-w-md w-full text-center space-y-4 animate-fade-up">
            <div className="w-12 h-12 rounded-full bg-ancient-red/20 border border-ancient-red flex items-center justify-center mx-auto text-vermilion">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-ivory">
              PURGE ALL REGISTRY DATA?
            </h3>
            <p className="text-xs text-aged-paper/70 font-noto">
              This will erase all locally stored signatures, identity seals, and member records from this browser. This action cannot be undone.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-5 py-2.5 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/20 text-xs font-cinzel"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-5 py-2.5 rounded bg-ancient-red text-ivory hover:bg-vermilion text-xs font-cinzel font-bold shadow-lg cursor-pointer"
              >
                CONFIRM PURGE
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
