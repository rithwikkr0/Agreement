import React, { useState } from 'react';
import { teamConfig } from '../config/team';
import type { AgreementData } from '../services/agreement';
import ImperialSeal from './ImperialSeal';
import {
  ShieldCheck,
  Clock,
  Users,
  Eye,
  Download,
  Share2,
  PlusCircle,
  Copy,
  Check,
  Upload,
  AlertTriangle,
  Sparkles,
  Link as LinkIcon,
} from 'lucide-react';
import {
  formatImperialDate,
  generateTeamSyncLink,
  decodeAgreementToken,
  decodeTeamRegistryToken,
} from '../services/agreement';
import { importSingleMember, importMultipleMembers } from '../services/storage';

interface TeamRegistryProps {
  members: AgreementData[];
  onSelectMember?: (member: AgreementData) => void;
  onRefreshData?: () => void;
}

export default function TeamRegistry({
  members,
  onSelectMember,
  onRefreshData,
}: TeamRegistryProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [showShareTeamModal, setShowShareTeamModal] = useState(false);
  const [importInput, setImportInput] = useState('');
  const [importError, setImportError] = useState<string | null>(null);
  const [importSuccess, setImportSuccess] = useState<string | null>(null);
  const [copiedTeamLink, setCopiedTeamLink] = useState(false);

  const maxMembers = teamConfig.maximumMembers || 10;
  const sealedCount = members.filter((m) => m.status === 'sealed').length;

  // Build an array of 10 slots
  const memberSlots = Array.from({ length: maxMembers }).map((_, index) => {
    const existing = members[index];
    return {
      slotIndex: index + 1,
      member: existing || null,
    };
  });

  const teamSyncLink = generateTeamSyncLink(members);

  const handleCopyTeamSyncLink = () => {
    navigator.clipboard.writeText(teamSyncLink);
    setCopiedTeamLink(true);
    setTimeout(() => setCopiedTeamLink(false), 3000);
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
      // 1. Check if it's a URL containing sync_seal or sync_team
      if (input.includes('sync_seal=')) {
        const token = input.split('sync_seal=')[1].split('&')[0];
        const member = decodeAgreementToken(token);
        if (member) {
          const res = importSingleMember(member);
          if (res.success) {
            setImportSuccess(res.message);
            setImportInput('');
            if (onRefreshData) onRefreshData();
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
          setImportSuccess(`Successfully synced ${res.addedCount} new member(s) into slots!`);
          setImportInput('');
          if (onRefreshData) onRefreshData();
          return;
        }
      }

      // 2. Try decoding as direct agreement token
      const singleMember = decodeAgreementToken(input);
      if (singleMember) {
        const res = importSingleMember(singleMember);
        if (res.success) {
          setImportSuccess(res.message);
          setImportInput('');
          if (onRefreshData) onRefreshData();
          return;
        } else {
          setImportError(res.message);
          return;
        }
      }

      // 3. Try decoding as team token
      const teamMembers = decodeTeamRegistryToken(input);
      if (teamMembers.length > 0) {
        const res = importMultipleMembers(teamMembers);
        setImportSuccess(`Synced ${res.addedCount} member(s)!`);
        setImportInput('');
        if (onRefreshData) onRefreshData();
        return;
      }

      // 4. Try parsing raw JSON
      try {
        const parsed = JSON.parse(input);
        if (parsed && parsed.memberName) {
          const res = importSingleMember(parsed as AgreementData);
          if (res.success) {
            setImportSuccess(res.message);
            setImportInput('');
            if (onRefreshData) onRefreshData();
            return;
          }
        } else if (parsed && Array.isArray(parsed.members)) {
          const res = importMultipleMembers(parsed.members);
          setImportSuccess(`Synced ${res.addedCount} member(s)!`);
          setImportInput('');
          if (onRefreshData) onRefreshData();
          return;
        }
      } catch {}

      setImportError('Unrecognized sync code or link format. Please ensure you copied the full sync link.');
    } catch (err) {
      console.error('Import error:', err);
      setImportError('Failed to import member. Please verify the code.');
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
          "Each seal inscribed upon this ledger binds a fellowship of mutual accountability across all devices."
        </p>

        {/* Status bar & Action Controls */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-3 bg-obsidian px-5 py-2.5 rounded-full border border-imperial-gold/30 text-xs font-cinzel tracking-wider shadow-lg">
            <span className="flex items-center gap-1.5 text-bright-gold font-bold">
              <Users className="w-3.5 h-3.5" />
              <span>PROGRESS:</span>
              <span>{sealedCount} / {maxMembers} SEALED</span>
            </span>
            <span className="text-imperial-gold/40">|</span>
            <span className="text-aged-paper/70">
              MINIMUM: {teamConfig.minimumMembers || 4}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="btn-imperial px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-transform"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>IMPORT / SYNC TEAMMATE SEAL</span>
          </button>

          {sealedCount > 0 && (
            <button
              type="button"
              onClick={() => setShowShareTeamModal(true)}
              className="px-4 py-2 rounded-full bg-black/60 text-bright-gold hover:text-white border border-imperial-gold/40 hover:border-imperial-gold text-xs font-cinzel tracking-wider flex items-center gap-1.5 cursor-pointer transition-colors shadow"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>SHARE ALL SLOTS LINK</span>
            </button>
          )}
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
                  ? 'border-imperial-gold/50 hover:border-imperial-gold shadow-xl hover:shadow-imperial-gold/15'
                  : 'border-white/5 opacity-70'
              }`}
            >
              {/* Member Slot Header */}
              <div className="w-full flex items-center justify-between mb-3 text-[10px] font-cinzel text-imperial-gold/70">
                <span className="font-bold tracking-widest">SLOT {formattedIndex}</span>
                {isSealed ? (
                  <span className="flex items-center gap-1 text-jade font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" /> SEALED
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
                  {isSealed ? member.role || 'Fellow Member' : 'Awaiting Oath'}
                </p>
              </div>

              {/* Details and Actions */}
              <div className="w-full mt-4 pt-3 border-t border-imperial-gold/10 text-[10px] font-cinzel text-imperial-gold/60 flex flex-col gap-1">
                {isSealed ? (
                  <>
                    <span className="truncate text-bright-gold/80 font-mono">{member.agreementId}</span>
                    <span className="text-[9px] text-aged-paper/50">
                      {formatImperialDate(member.timestamp)}
                    </span>
                    {onSelectMember && (
                      <button
                        type="button"
                        onClick={() => onSelectMember(member)}
                        className="mt-2 w-full py-1.5 text-[10px] bg-imperial-gold/10 hover:bg-imperial-gold/20 text-bright-gold rounded border border-imperial-gold/30 transition-colors flex items-center justify-center gap-1 cursor-pointer font-bold"
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

      {/* MODAL 1: Import Teammate Seal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-dark imperial-border p-6 sm:p-8 rounded max-w-lg w-full text-left space-y-4 animate-fade-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-imperial-gold/20 pb-3">
              <h3 className="font-cinzel text-base font-bold text-bright-gold flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-bright-gold" />
                <span>SYNC & IMPORT TEAMMATE SEAL</span>
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
              When a friend signs the covenant on their phone, they receive a <strong>Sync Link</strong>. Paste their link or code below to add them to your team slots!
            </p>

            <div>
              <label
                htmlFor="import-input-field"
                className="block text-[11px] font-cinzel text-imperial-gold uppercase font-bold mb-1.5"
              >
                Paste Teammate Sync Link or Code:
              </label>
              <textarea
                id="import-input-field"
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
                ADD TO SLOTS
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

      {/* MODAL 2: Share All Team Slots Link */}
      {showShareTeamModal && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="glass-dark imperial-border p-6 sm:p-8 rounded max-w-lg w-full text-left space-y-4 animate-fade-up shadow-2xl">
            <div className="flex items-center justify-between border-b border-imperial-gold/20 pb-3">
              <h3 className="font-cinzel text-base font-bold text-bright-gold flex items-center gap-2">
                <Share2 className="w-5 h-5 text-bright-gold" />
                <span>SHARE MASTER TEAM SYNC LINK</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowShareTeamModal(false)}
                className="text-aged-paper/50 hover:text-ivory text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-aged-paper/80 font-noto leading-relaxed">
              Share this master sync link with your group chat. Anyone who opens it will automatically have all <strong>{sealedCount} currently sealed members</strong> populated into their team slots!
            </p>

            <div className="p-3 bg-black/60 rounded border border-imperial-gold/30 break-all text-[11px] font-mono text-aged-paper/80 max-h-24 overflow-y-auto">
              {teamSyncLink}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowShareTeamModal(false)}
                className="px-4 py-2 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/20 text-xs font-cinzel cursor-pointer"
              >
                CLOSE
              </button>

              <button
                type="button"
                onClick={handleCopyTeamSyncLink}
                className="btn-imperial px-6 py-2 rounded text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
              >
                {copiedTeamLink ? <Check className="w-4 h-4 text-jade" /> : <Copy className="w-4 h-4" />}
                <span>{copiedTeamLink ? 'LINK COPIED!' : 'COPY TEAM SYNC LINK'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
