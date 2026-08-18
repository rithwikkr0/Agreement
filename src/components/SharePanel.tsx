import React, { useState } from 'react';
import { Share2, Download, Copy, Check, FileText } from 'lucide-react';
import type { AgreementData } from '../services/agreement';
import { generateCovenantPDF } from '../services/pdf';

interface SharePanelProps {
  member: AgreementData;
}

export default function SharePanel({ member }: SharePanelProps) {
  const [copied, setCopied] = useState(false);
  const [shareMessage, setShareMessage] = useState<string | null>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPdf(true);
    try {
      await generateCovenantPDF(member);
    } catch (err) {
      console.error('PDF generation error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `The Imperial Covenant — ${member.memberName}`,
      text: `I have sealed the Imperial Covenant for ${member.memberName} (ID: ${member.agreementId}).`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fallback to downloading
          await handleDownloadPDF();
          setShareMessage(
            'Your browser does not support direct sharing. The PDF has been downloaded. You can now send it manually.'
          );
        }
      }
    } else {
      // Fallback
      await handleDownloadPDF();
      setShareMessage(
        'Your browser does not support direct sharing. The PDF has been downloaded. You can now send it manually.'
      );
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(
      `${window.location.origin}${window.location.pathname}?covenant_id=${member.agreementId}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-6 p-6 rounded-sm glass-dark imperial-border text-center">
      <h4 className="font-cinzel text-base font-bold text-ivory tracking-wide mb-2">
        SHARE & PRESERVE YOUR SEAL
      </h4>
      <p className="text-xs text-aged-paper/70 font-noto mb-6">
        Distribute your sealed covenant document or export your official PDF certificate.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {/* Native Share */}
        <button
          onClick={handleShare}
          className="w-full sm:w-auto btn-imperial px-5 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
        >
          <Share2 className="w-4 h-4" />
          <span>SHARE COVENANT</span>
        </button>

        {/* Direct PDF Download */}
        <button
          onClick={handleDownloadPDF}
          disabled={isGeneratingPdf}
          className="w-full sm:w-auto btn-vermilion px-5 py-2.5 rounded text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          <span>{isGeneratingPdf ? 'GENERATING PDF...' : 'DOWNLOAD PDF'}</span>
        </button>

        {/* Copy Link */}
        <button
          onClick={handleCopyLink}
          className="w-full sm:w-auto px-4 py-2.5 rounded bg-black/60 text-aged-paper hover:text-ivory border border-imperial-gold/30 hover:border-imperial-gold flex items-center justify-center gap-2 text-xs font-cinzel tracking-wider transition-colors cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-jade" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'LINK COPIED' : 'COPY LINK'}</span>
        </button>
      </div>

      {shareMessage && (
        <div className="mt-4 p-3 rounded bg-imperial-gold/10 border border-imperial-gold/30 text-[11px] text-aged-paper text-left flex items-start gap-2">
          <FileText className="w-4 h-4 text-bright-gold shrink-0 mt-0.5" />
          <span>{shareMessage}</span>
        </div>
      )}
    </div>
  );
}
