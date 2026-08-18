import React, { useState } from 'react';
import { Share2, Download, Copy, Check, FileText, AlertTriangle, Link as LinkIcon, Users } from 'lucide-react';
import type { AgreementData } from '../services/agreement';
import { generateCovenantPDFBlob, downloadCovenantPDF } from '../services/pdf';
import { generateMemberSyncLink, encodeAgreementToken } from '../services/agreement';

interface SharePanelProps {
  member: AgreementData;
}

export default function SharePanel({ member }: SharePanelProps) {
  const [copiedSync, setCopiedSync] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'info' | 'success' | 'warn'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvancedToken, setShowAdvancedToken] = useState(false);

  const syncLink = generateMemberSyncLink(member);
  const syncToken = encodeAgreementToken(member);

  const handleCopySyncLink = () => {
    navigator.clipboard.writeText(syncLink);
    setCopiedSync(true);
    setStatusMessage({
      type: 'success',
      text: 'Sync link copied to clipboard! Share this link with your team leader or group chat. When they open it, your seal will automatically appear in their team slots!',
    });
    setTimeout(() => setCopiedSync(false), 4000);
  };

  const handleShareSyncLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `The Imperial Covenant — ${member.memberName}'s Sealed Oath`,
          text: `I have sealed the Imperial Covenant for ${member.memberName} (ID: ${member.agreementId}). Tap this link to sync my seal into your team slots:`,
          url: syncLink,
        });
        setStatusMessage({
          type: 'success',
          text: 'Sync link shared with your team!',
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopySyncLink();
        }
      }
    } else {
      handleCopySyncLink();
    }
  };

  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      await downloadCovenantPDF(member);
      setStatusMessage({
        type: 'success',
        text: `Official certificate 'Covenant-${member.memberName.replace(/\s+/g, '-')}-${member.agreementId}.pdf' downloaded successfully.`,
      });
    } catch (err) {
      console.error('PDF download error:', err);
      setStatusMessage({
        type: 'warn',
        text: 'Failed to generate PDF document. Please check browser memory and try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSharePDF = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      const { file, fileName } = await generateCovenantPDFBlob(member);

      const sharePayload = {
        title: `The Imperial Covenant — ${member.memberName}`,
        text: `Official Covenant Certificate for ${member.memberName} (Agreement ID: ${member.agreementId}).`,
        files: [file],
      };

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share(sharePayload);
          setStatusMessage({
            type: 'success',
            text: 'Official Covenant PDF certificate shared successfully!',
          });
        } catch (shareErr: any) {
          if (shareErr.name !== 'AbortError') {
            await downloadCovenantPDF(member);
            setStatusMessage({
              type: 'info',
              text: 'Direct PDF sharing was cancelled. The official PDF has been downloaded to your device so you can send it manually.',
            });
          }
        }
      } else {
        await downloadCovenantPDF(member);
        setStatusMessage({
          type: 'info',
          text: `Your browser does not support direct file sharing. The official PDF (${fileName}) has been downloaded to your device.`,
        });
      }
    } catch (err) {
      console.error('Share error:', err);
      await downloadCovenantPDF(member);
      setStatusMessage({
        type: 'info',
        text: 'The PDF has been downloaded to your device so you can share it manually.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto mt-6 p-6 sm:p-8 rounded-sm glass-dark imperial-border text-center shadow-2xl space-y-5">
      {/* Primary Callout: Sync With Team */}
      <div className="p-4 rounded bg-imperial-gold/15 border border-imperial-gold/40 text-left space-y-2">
        <div className="flex items-center gap-2 text-bright-gold font-cinzel text-xs font-bold uppercase">
          <Users className="w-4 h-4" />
          <span>JOIN YOUR TEAM'S SLOTS</span>
        </div>
        <p className="text-xs text-ivory/90 font-noto leading-relaxed">
          Send your <strong>Team Sync Link</strong> to your group chat or team leader. When they open it, your seal will instantly be inscribed into their team registry slots!
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleShareSyncLink}
            className="btn-imperial px-4 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md flex-1"
          >
            <Share2 className="w-4 h-4" />
            <span>SHARE SYNC LINK</span>
          </button>

          <button
            type="button"
            onClick={handleCopySyncLink}
            className="px-4 py-2.5 rounded bg-black/60 text-bright-gold hover:text-white border border-imperial-gold/40 hover:border-imperial-gold flex items-center justify-center gap-2 text-xs font-cinzel tracking-wider transition-colors cursor-pointer flex-1"
          >
            {copiedSync ? <Check className="w-4 h-4 text-jade" /> : <Copy className="w-4 h-4" />}
            <span>{copiedSync ? 'LINK COPIED!' : 'COPY SYNC LINK'}</span>
          </button>
        </div>
      </div>

      {/* PDF Export Section */}
      <div className="pt-2 border-t border-imperial-gold/15 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isProcessing}
          className="w-full sm:w-auto btn-vermilion px-5 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD 4-PAGE PDF</span>
        </button>

        <button
          type="button"
          onClick={handleSharePDF}
          disabled={isProcessing}
          className="w-full sm:w-auto px-4 py-2.5 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center justify-center gap-2 text-xs font-cinzel tracking-wider transition-colors cursor-pointer"
        >
          <FileText className="w-4 h-4 text-bright-gold" />
          <span>SHARE PDF FILE</span>
        </button>
      </div>

      {/* Advanced Sync Token toggle */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setShowAdvancedToken(!showAdvancedToken)}
          className="text-[11px] font-cinzel text-imperial-gold/60 hover:text-bright-gold underline transition-colors cursor-pointer"
        >
          {showAdvancedToken ? 'Hide Manual Sync Code' : 'Need manual sync code? (Click here)'}
        </button>

        {showAdvancedToken && (
          <div className="mt-3 p-3 rounded bg-black/70 border border-imperial-gold/25 text-left text-[11px] font-mono space-y-2">
            <span className="text-imperial-gold font-cinzel text-[10px] uppercase font-bold block">
              YOUR SEAL SYNC CODE:
            </span>
            <div className="p-2 bg-black/50 rounded border border-white/10 break-all select-all text-aged-paper/80 max-h-20 overflow-y-auto">
              {syncToken}
            </div>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(syncToken);
                setCopiedToken(true);
                setTimeout(() => setCopiedToken(false), 3000);
              }}
              className="text-xs font-cinzel text-bright-gold hover:underline flex items-center gap-1 cursor-pointer"
            >
              {copiedToken ? <Check className="w-3.5 h-3.5 text-jade" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedToken ? 'Code Copied!' : 'Copy Code'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Status Feedback Message */}
      {statusMessage && (
        <div
          className={`mt-4 p-3.5 rounded text-left flex items-start gap-2.5 text-xs font-noto leading-relaxed animate-fade-up ${
            statusMessage.type === 'success'
              ? 'bg-jade/15 border border-jade/40 text-ivory'
              : statusMessage.type === 'warn'
              ? 'bg-ancient-red/20 border border-vermilion text-ivory'
              : 'bg-imperial-gold/10 border border-imperial-gold/30 text-aged-paper'
          }`}
        >
          {statusMessage.type === 'warn' ? (
            <AlertTriangle className="w-4 h-4 text-vermilion shrink-0 mt-0.5" />
          ) : (
            <FileText className="w-4 h-4 text-bright-gold shrink-0 mt-0.5" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}
    </div>
  );
}
