import React, { useState } from 'react';
import type { AgreementData } from '../services/agreement';
import { exportMembersJSON, resetAllData, importSingleMember, importMultipleMembers } from '../services/storage';
import { downloadCovenantPDF } from '../services/pdf';
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
  PlusCircle,
  Share2,
  Copy,
  Check,
  Upload,
} from 'lucide-react';
import {
  formatImperialDate,
  formatImperialTime,
  generateTeamSyncLink,
  decodeAgreementToken,
  decodeTeamRegistryToken,
} from '../services/agreement';

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
  const [showImportModal, setShowImportModal] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [copiedTeamLink, setCopiedTeamLink] = useState(false);

  const maxMembers = teamConfig.maximumMembers || 10;
  const sealedCount = members.filter((m) => m.status === 'sealed').length;

  const handleExportJSON = () => {
    const jsonStr = exportMembersJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `covenant-registry-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleConfirmReset = () => {
    resetAllData();
    setShowResetConfirm(false);
    onRefreshData();
  };

  const handleManualImport = () => {
    setImportError(null);
    setImportSuccess(null);

    const input = importInput.trim();
    if (!input) {
      setImportError('Please enter a sync link, token, or JSON payload.');
      return;
    }

    try {
      if (input.includes('sync_seal=')) {
        const token = input.split('sync_seal=')[1].split('&')[0];
        const member = decodeAgreementToken(token);
        if (member) {
          const res = importSingleMember(member);
          if (res.success) {
            setImportSuccess(res.message);
            setImportInput('');
            onRefreshData();
            return;
          } else {
            setImportError(res.message);
            return;
          }
        }
      }

      if (input.includes('sync_team=')) {
        const token = input.split('sync_team=')[1].split('&')[0];
        const incoming = decodeTeamRegistryToken(token);
        if (incoming.length > 0) {
          const res = importMultipleMembers(incoming);
          setImportSuccess(`Synced ${res.addedCount} new member(s)!`);
          setImportInput('');
          onRefreshData();
          return;
        }
      }

      const singleMember = decodeAgreementToken(input);
      if (singleMember) {
        const res = importSingleMember(singleMember);
        if (res.success) {
          setImportSuccess(res.message);
          setImportInput('');
          onRefreshData();
          return;
        } else {
          setImportError(res.message);
          return;
        }
      }

      const teamMembers = decodeTeamRegistryToken(input);
      if (teamMembers.length > 0) {
        const res = importMultipleMembers(teamMembers);
        setImportSuccess(`Synced ${res.addedCount} member(s)!`);
        setImportInput('');
        onRefreshData();
        return;
      }

      try {
        const parsed = JSON.parse(input);
        if (parsed && parsed.memberName) {
          const res = importSingleMember(parsed as AgreementData);
          if (res.success) {
            setImportSuccess(res.message);
            setImportInput('');
            onRefreshData();
            return;
          }
        } else if (parsed && Array.isArray(parsed.members)) {
          const res = importMultipleMembers(parsed.members);
          setImportSuccess(`Synced ${res.addedCount} member(s)!`);
          setImportInput('');
          onRefreshData();
          return;
        }
      } catch {}

      setImportError('Unrecognized sync format. Please paste a valid sync link or code.');
    } catch {
      setImportError('Failed to import data.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const content = evt.target?.result as string;
      setImportInput(content);
    };
    reader.readAsText(file);
  };

  const teamSyncLink = generateTeamSyncLink(members);

  const handleCopyTeamSyncLink = () => {
    navigator.clipboard.writeText(teamSyncLink);
    setCopiedTeamLink(true);
    setTimeout(() => setCopiedTeamLink(false), 3000);
  };

  // Build rows up to maxMembers
  const slots = Array.from({ length: maxMembers }).map((_, i) => {
    return members[i] || null;
  });

  return (
    <section className="relative w-full max-w-5xl mx-auto px-4 py-16">
      {/* Header and Navigation */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-cinzel text-imperial-gold/80 hover:text-bright-gold flex items-center gap-2 transition-colors cursor-pointer bg-black/40 px-4 py-2 rounded border border-imperial-gold/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>RETURN TO COVENANT</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="px-3.5 py-2 rounded bg-imperial-gold/20 text-bright-gold hover:text-white border border-imperial-gold/40 hover:border-imperial-gold flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer shadow"
          >
            <PlusCircle className="w-4 h-4" />
            <span>IMPORT SEAL</span>
          </button>

          {sealedCount > 0 && (
            <button
              type="button"
              onClick={handleCopyTeamSyncLink}
              className="px-3.5 py-2 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer shadow"
            >
              {copiedTeamLink ? <Check className="w-4 h-4 text-jade" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedTeamLink ? 'LINK COPIED' : 'SHARE TEAM LINK'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleExportJSON}
            className="px-3.5 py-2 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer shadow"
          >
            <FileCode className="w-4 h-4 text-bright-gold" />
            <span>EXPORT JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 rounded bg-ancient-red/25 text-vermilion hover:text-white border border-ancient-red/40 hover:border-vermilion flex items-center gap-1.5 text-xs font-cinzel tracking-wider transition-colors cursor-pointer shadow"
          >
            <Trash2 className="w-4 h-4" />
            <span>RESET</span>
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
              Real-time local status of all member seals, signatures, and agreement records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-obsidian rounded border border-imperial-gold/30 text-center">
              <span className="text-[10px] font-cinzel text-imperial-gold/60 block font-bold">SEALED</span>
              <span className="font-cinzel text-xl font-bold text-jade">{sealedCount}</span>
            </div>
            <div className="px-4 py-2 bg-obsidian rounded border border-imperial-gold/30 text-center">
              <span className="text-[10px] font-cinzel text-imperial-gold/60 block font-bold">PENDING</span>
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
                      {isSealed ? (
                        member.memberName
                      ) : (
                        <span className="text-aged-paper/30 italic">Slot {formattedSlot} (Unassigned)</span>
                      )}
                    </td>
                    <td className="py-4 px-3 text-aged-paper/80 font-noto">
                      {isSealed ? member.role || 'Member' : '—'}
                    </td>
                    <td className="py-4 px-3 font-mono text-bright-gold/90 font-semibold">
                      {isSealed ? member.agreementId : '—'}
                    </td>
                    <td className="py-4 px-3 text-aged-paper/70 font-noto text-[11px]">
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
                            type="button"
                            onClick={() => onViewMember(member)}
                            className="p-1.5 rounded bg-imperial-gold/10 hover:bg-imperial-gold/20 text-bright-gold border border-imperial-gold/30 transition-colors cursor-pointer"
                            title="View Member Record"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadCovenantPDF(member)}
                            className="p-1.5 rounded bg-vermilion/20 hover:bg-vermilion/30 text-ivory border border-vermilion/40 transition-colors cursor-pointer"
                            title="Download Member PDF"
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

      {/* MODAL 1: Import Member */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-dark imperial-border p-6 sm:p-8 rounded max-w-lg w-full text-left space-y-4 animate-fade-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-imperial-gold/20 pb-3">
              <h3 className="font-cinzel text-base font-bold text-bright-gold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-bright-gold" />
                <span>IMPORT MEMBER SEAL TO REGISTRY</span>
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowImportModal(false);
                  setImportError(null);
                  setImportSuccess(null);
                }}
                className="text-aged-paper/50 hover:text-ivory text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-aged-paper/80 font-noto leading-relaxed">
              Paste a teammate's <strong>Sync Link</strong> or <strong>Sync Code</strong> below to import their sealed covenant into your local registry slots.
            </p>

            <div>
              <textarea
                value={importInput}
                onChange={(e) => setImportInput(e.target.value)}
                placeholder="Paste link e.g. https://.../?sync_seal=... or code token"
                className="parchment-input w-full p-3 text-xs font-mono h-24 rounded focus:ring-2 focus:ring-imperial-gold"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-xs text-imperial-gold/70 hover:text-bright-gold flex items-center gap-1.5 cursor-pointer underline font-noto">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload JSON file</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleManualImport}
                disabled={!importInput.trim()}
                className="btn-imperial px-6 py-2 rounded text-xs font-bold disabled:opacity-40 cursor-pointer shadow"
              >
                IMPORT TO SLOTS
              </button>
            </div>

            {importSuccess && (
              <div className="p-3 rounded bg-jade/20 border border-jade/40 text-xs text-ivory font-noto flex items-start gap-2">
                <Check className="w-4 h-4 text-jade shrink-0 mt-0.5" />
                <span>{importSuccess}</span>
              </div>
            )}

            {importError && (
              <div className="p-3 rounded bg-ancient-red/20 border border-vermilion text-xs text-ivory font-noto flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
                <span>{importError}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-dark imperial-border p-6 sm:p-8 rounded max-w-md w-full text-center space-y-4 animate-fade-up">
            <div className="w-12 h-12 rounded-full bg-ancient-red/20 border border-ancient-red flex items-center justify-center mx-auto text-vermilion">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="font-cinzel text-lg font-bold text-ivory">
              PURGE ALL REGISTRY DATA?
            </h3>
            <p className="text-xs text-aged-paper/70 font-noto leading-relaxed">
              This will erase all locally stored signatures, identity portrait seals, and member records from this browser. This action cannot be undone.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-5 py-2.5 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/20 text-xs font-cinzel cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="button"
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
