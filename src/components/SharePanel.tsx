import React, { useState } from 'react';
import { Share2, Download, Copy, Check, FileText, AlertTriangle } from 'lucide-react';
import type { AgreementData } from '../services/agreement';
import { generateCovenantPDFBlob, downloadCovenantPDF } from '../services/pdf';

interface SharePanelProps {
  member: AgreementData;
}

export default function SharePanel({ member }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'info' | 'success' | 'warn'; text: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDownloadPDF = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      await downloadCovenantPDF(member);
      setStatusMessage({
        type: 'success',
        text: `The official certificate 'Covenant-${member.memberName.replace(/\s+/g, '-')}-${member.agreementId}.pdf' has been generated and downloaded.`,
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

  const handleShare = async () => {
    setIsProcessing(true);
    setStatusMessage(null);
    try {
      // 1. Generate real PDF File object
      const { file, fileName } = await generateCovenantPDFBlob(member);

      const sharePayload = {
        title: `The Imperial Covenant — ${member.memberName}`,
        text: `Official Covenant Certificate for ${member.memberName} (Agreement ID: ${member.agreementId}).`,
        files: [file],
      };

      // 2. Test if browser can share files directly
      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        try {
          await navigator.share(sharePayload);
          setStatusMessage({
            type: 'success',
            text: 'Official Covenant PDF shared successfully!',
          });
        } catch (shareErr: any) {
          if (shareErr.name !== 'AbortError') {
            // Fallback to downloading
            await downloadCovenantPDF(member);
            setStatusMessage({
              type: 'info',
              text: 'Direct file sharing was cancelled or unsupported. The official PDF has been downloaded to your device so you can share it manually.',
            });
          }
        }
      } else {
        // Fallback to downloading PDF
        await downloadCovenantPDF(member);
        setStatusMessage({
          type: 'info',
          text: `Your browser does not support direct PDF file sharing. The official PDF (${fileName}) has been downloaded to your device so you can send it manually.`,
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}?covenant_id=${member.agreementId}`
    );
    setCopied(true);
    setStatusMessage({
      type: 'info',
      text: 'Covenant page link copied. Note: For complete data privacy ($0 server cost), the official PDF document is the canonical portable record to share with teammates.',
    });
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6 p-6 rounded-sm glass-dark imperial-border text-center shadow-2xl">
      <h4 className="font-cinzel text-base font-bold text-ivory tracking-wide mb-1.5">
        PRESERVE & SHARE YOUR SEAL
      </h4>
      <p className="text-xs text-aged-paper/70 font-noto mb-6">
        Export your 3-page official certificate PDF or share it with your team.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Native Web Share with PDF File */}
        <button
          type="button"
          onClick={handleShare}
          disabled={isProcessing}
          className="w-full sm:w-auto btn-imperial px-5 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Share2 className="w-4 h-4" />
          <span>{isProcessing ? 'PREPARING...' : 'SHARE PDF'}</span>
        </button>

        {/* Direct PDF Download */}
        <button
          type="button"
          onClick={handleDownloadPDF}
          disabled={isProcessing}
          className="w-full sm:w-auto btn-vermilion px-5 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD PDF</span>
        </button>

        {/* Copy Page Link */}
        <button
          type="button"
          onClick={handleCopyLink}
          className="w-full sm:w-auto px-4 py-2.5 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center justify-center gap-2 text-xs font-cinzel tracking-wider transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-jade" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'LINK COPIED' : 'COPY PAGE LINK'}</span>
        </button>
      </div>

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
