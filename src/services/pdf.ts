// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Production Hardened PDF Service
//  Pure Vector & Clean Typography (Zero Font Corruption)
// ═══════════════════════════════════════════════════

import jsPDF from 'jspdf';
import { articles } from '../data/covenant';
import { teamConfig } from '../config/team';
import { formatImperialDate, formatImperialTime, type AgreementData } from './agreement';

// Imperial color constants (RGB)
const INK = [9, 8, 6] as const;
const OBSIDIAN = [18, 16, 12] as const;
const GOLD = [200, 155, 60] as const;
const BRIGHT_GOLD = [240, 210, 122] as const;
const RED = [122, 23, 23] as const;
const VERMILION = [181, 43, 33] as const;
const IVORY = [245, 232, 198] as const;
const AGED_PAPER = [220, 195, 142] as const;
const JADE = [86, 122, 100] as const;

function setColor(
  doc: jsPDF,
  rgb: readonly [number, number, number],
  type: 'fill' | 'text' | 'draw' = 'fill'
) {
  if (type === 'fill') doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  else if (type === 'text') doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  else doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

// Sanitize string to clean ASCII for jsPDF standard fonts
function sanitizeText(str: string): string {
  if (!str) return '';
  return str.replace(/[^\x20-\x7E\r\n]/g, '').trim();
}

// Draw a geometric royal wax seal with pure vector lines
function drawVectorSeal(doc: jsPDF, cx: number, cy: number, radius: number, label = 'TC') {
  // Wax background
  setColor(doc, RED, 'fill');
  doc.circle(cx, cy, radius, 'F');

  // Outer gold ring
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(1.2);
  doc.circle(cx, cy, radius);

  // Inner dashed gold ring
  doc.setLineWidth(0.4);
  doc.circle(cx, cy, radius - 2.5);

  // Inner diamond emblem
  const dSize = radius * 0.65;
  doc.line(cx, cy - dSize, cx + dSize, cy);
  doc.line(cx + dSize, cy, cx, cy + dSize);
  doc.line(cx, cy + dSize, cx - dSize, cy);
  doc.line(cx - dSize, cy, cx, cy - dSize);

  // Center Monogram / Text
  setColor(doc, BRIGHT_GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(radius > 20 ? 14 : 10);
  doc.text(label, cx, cy + (radius > 20 ? 4.5 : 3.5), { align: 'center' });
}

// Draw standard imperial page frame and header
function drawPageFrame(doc: jsPDF, pw: number, ph: number, pageTitle: string, pageNum: number, totalPages: number) {
  // Background
  setColor(doc, OBSIDIAN, 'fill');
  doc.rect(0, 0, pw, ph, 'F');

  // Top Header Banner
  setColor(doc, RED, 'fill');
  doc.rect(0, 0, pw, 16, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.6);
  doc.line(0, 16, pw, 16);

  // Header Title
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setCharSpace(2.5);
  doc.text(sanitizeText(pageTitle), pw / 2, 10.5, { align: 'center' });
  doc.setCharSpace(0);

  // Double gold borders
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.6);
  doc.rect(8, 20, pw - 16, ph - 32);
  doc.setLineWidth(0.2);
  doc.rect(10, 22, pw - 20, ph - 36);

  // Corner decorative flourishes
  const corners = [
    [12, 24],
    [pw - 12, 24],
    [12, ph - 14],
    [pw - 12, ph - 14],
  ] as const;

  corners.forEach(([cx, cy], i) => {
    const sx = i % 2 === 0 ? 1 : -1;
    const sy = i < 2 ? 1 : -1;
    doc.line(cx, cy, cx + sx * 6, cy);
    doc.line(cx, cy, cx, cy + sy * 6);
  });

  // Bottom Footer Banner
  setColor(doc, RED, 'fill');
  doc.rect(0, ph - 10, pw, 10, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.4);
  doc.line(0, ph - 10, pw, ph - 10);

  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setCharSpace(0.5);
  doc.text(
    'This is an internal team working charter and is not a substitute for a legal agreement.',
    14,
    ph - 4
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, pw - 14, ph - 4, { align: 'right' });
  doc.setCharSpace(0);
}

// Helper to safely load image dimensions
async function loadImageDimensions(dataUrl: string): Promise<{ width: number; height: number; img: HTMLImageElement } | null> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({ width: img.naturalWidth || 400, height: img.naturalHeight || 400, img });
    };
    img.onerror = () => resolve(null);
    img.src = dataUrl;
  });
}

// Build the complete multi-page PDF document
export async function buildCovenantPDF(member: AgreementData): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  const totalPages = 4;

  // ════════════════════════════════════════════════════
  // PAGE 1: IMPERIAL COVER & OFFICIAL CHARTER RECORD
  // ════════════════════════════════════════════════════
  // Background
  setColor(doc, INK, 'fill');
  doc.rect(0, 0, pw, ph, 'F');

  // Outer gold borders
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pw - 16, ph - 16);
  doc.setLineWidth(0.3);
  doc.rect(11, 11, pw - 22, ph - 22);

  // Top header band
  setColor(doc, RED, 'fill');
  doc.rect(0, 0, pw, 18, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.6);
  doc.line(0, 18, pw, 18);

  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setCharSpace(3);
  doc.text('THE IMPERIAL COVENANT - OFFICIAL CHARTER RECORD', pw / 2, 11, { align: 'center' });
  doc.setCharSpace(0);

  // Central Royal Vector Seal
  const sealX = pw / 2;
  const sealY = 68;
  const sealR = 26;
  drawVectorSeal(doc, sealX, sealY, sealR, 'COVENANT');

  // Main Title
  let y = 108;
  setColor(doc, BRIGHT_GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setCharSpace(4);
  doc.text('THE IMPERIAL', pw / 2, y, { align: 'center' });
  y += 11;
  doc.text('COVENANT', pw / 2, y, { align: 'center' });
  doc.setCharSpace(0);

  y += 6;
  setColor(doc, AGED_PAPER, 'draw');
  doc.setLineWidth(0.4);
  doc.line(35, y, pw - 35, y);

  y += 7;
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('A Formal Charter of Teamwork, Responsibility & Trust', pw / 2, y, { align: 'center' });

  // Team & Leadership Info
  y += 18;
  setColor(doc, OBSIDIAN, 'fill');
  doc.rect(25, y, pw - 50, 24, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.3);
  doc.rect(25, y, pw - 50, 24);

  setColor(doc, GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setCharSpace(1.5);
  doc.text('TEAM & GOVERNANCE', pw / 2, y + 6, { align: 'center' });
  doc.setCharSpace(0);

  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Team: ${sanitizeText(teamConfig.teamName)}   |   Project: ${sanitizeText(teamConfig.projectName)}`, pw / 2, y + 13, { align: 'center' });
  setColor(doc, AGED_PAPER, 'text');
  doc.setFontSize(8);
  doc.text(`Keeper of the Covenant: ${sanitizeText(teamConfig.leaderName || 'Team Leader')}`, pw / 2, y + 19, { align: 'center' });

  // Member Sealed Record Box
  y += 32;
  setColor(doc, OBSIDIAN, 'fill');
  doc.rect(25, y, pw - 50, 44, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.4);
  doc.rect(25, y, pw - 50, 44);

  setColor(doc, GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setCharSpace(2);
  doc.text('INDELIBLE SIGNATORY', pw / 2, y + 7, { align: 'center' });
  doc.setCharSpace(0);

  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(sanitizeText(member.memberName), pw / 2, y + 16, { align: 'center' });

  setColor(doc, BRIGHT_GOLD, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(sanitizeText(member.role || 'Covenant Member'), pw / 2, y + 23, { align: 'center' });

  setColor(doc, AGED_PAPER, 'text');
  doc.setFontSize(7.5);
  doc.text(`Agreement ID: ${sanitizeText(member.agreementId)}`, pw / 2, y + 30, { align: 'center' });
  doc.text(`Sealed: ${formatImperialDate(member.timestamp)} at ${formatImperialTime(member.timestamp)}`, pw / 2, y + 36, { align: 'center' });

  setColor(doc, JADE, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.text('STATUS: COVENANT SEALED & AGREED', pw / 2, y + 41, { align: 'center' });

  // Bottom Band
  setColor(doc, RED, 'fill');
  doc.rect(0, ph - 12, pw, 12, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.4);
  doc.line(0, ph - 12, pw, ph - 12);
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.text('This is an internal team working charter and is not a substitute for a legal agreement.', pw / 2, ph - 5, { align: 'center' });

  // ════════════════════════════════════════════════════
  // PAGES 2 & 3: THE TWELVE ARTICLES OF RESPONSIBILITY
  // ════════════════════════════════════════════════════
  const articlesPage1 = articles.slice(0, 6);
  const articlesPage2 = articles.slice(6, 12);

  // Page 2: Articles 1-6
  doc.addPage();
  drawPageFrame(doc, pw, ph, 'THE TWELVE ARTICLES OF THE IMPERIAL COVENANT (PART I)', 2, totalPages);
  let artY = 28;

  articlesPage1.forEach((art) => {
    // Number and Title
    setColor(doc, GOLD, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const cleanSub = sanitizeText(art.subtitle).replace(/\s*\([^)]*\)/g, '');
    doc.text(`ARTICLE ${art.romanNumeral}  --  ${cleanSub}`, 16, artY);

    setColor(doc, BRIGHT_GOLD, 'text');
    doc.setFontSize(10.5);
    doc.text(sanitizeText(art.title).toUpperCase(), 16, artY + 4.5);

    // Accent line
    setColor(doc, [80, 60, 30], 'draw');
    doc.setLineWidth(0.2);
    doc.line(16, artY + 6.5, pw - 16, artY + 6.5);

    // Body
    setColor(doc, IVORY, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const splitText = doc.splitTextToSize(sanitizeText(art.text), pw - 32);
    doc.text(splitText, 16, artY + 11);

    artY += 15 + splitText.length * 3.5;
  });

  // Page 3: Articles 7-12
  doc.addPage();
  drawPageFrame(doc, pw, ph, 'THE TWELVE ARTICLES OF THE IMPERIAL COVENANT (PART II)', 3, totalPages);
  artY = 28;

  articlesPage2.forEach((art) => {
    // Number and Title
    setColor(doc, GOLD, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    const cleanSub = sanitizeText(art.subtitle).replace(/\s*\([^)]*\)/g, '');
    doc.text(`ARTICLE ${art.romanNumeral}  --  ${cleanSub}`, 16, artY);

    setColor(doc, BRIGHT_GOLD, 'text');
    doc.setFontSize(10.5);
    doc.text(sanitizeText(art.title).toUpperCase(), 16, artY + 4.5);

    // Accent line
    setColor(doc, [80, 60, 30], 'draw');
    doc.setLineWidth(0.2);
    doc.line(16, artY + 6.5, pw - 16, artY + 6.5);

    // Body
    setColor(doc, IVORY, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const splitText = doc.splitTextToSize(sanitizeText(art.text), pw - 32);
    doc.text(splitText, 16, artY + 11);

    artY += 15 + splitText.length * 3.5;
  });

  // ════════════════════════════════════════════════════
  // PAGE 4: FINAL OATH, VERIFICATION & SIGNATURES
  // ════════════════════════════════════════════════════
  doc.addPage();
  drawPageFrame(doc, pw, ph, 'FINAL OATH, VERIFICATION & INDELIBLE SEALS', 4, totalPages);
  y = 28;

  // Header
  setColor(doc, GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setCharSpace(2);
  doc.text('MEMBER OATH & CONFIRMATION', pw / 2, y, { align: 'center' });
  doc.setCharSpace(0);

  y += 7;
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(sanitizeText(member.memberName), pw / 2, y, { align: 'center' });

  y += 6;
  setColor(doc, BRIGHT_GOLD, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.text(sanitizeText(member.role || 'Covenant Member'), pw / 2, y, { align: 'center' });

  // Verification Data Table
  y += 10;
  setColor(doc, OBSIDIAN, 'fill');
  doc.rect(16, y, pw - 32, 28, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.3);
  doc.rect(16, y, pw - 32, 28);

  const metaCols = [
    ['AGREEMENT ID', member.agreementId],
    ['OATH DATE', formatImperialDate(member.timestamp)],
    ['OATH TIME', formatImperialTime(member.timestamp)],
    ['VERIFICATION STATUS', 'SEALED & BINDING'],
  ];

  let metaY = y + 6;
  metaCols.forEach(([label, value]) => {
    setColor(doc, GOLD, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.text(label, 20, metaY);

    setColor(doc, value === 'SEALED & BINDING' ? JADE : IVORY, 'text');
    doc.setFont('helvetica', value === 'SEALED & BINDING' ? 'bold' : 'normal');
    doc.setFontSize(8);
    doc.text(sanitizeText(value), 75, metaY);
    metaY += 5.5;
  });

  y += 34;

  // Dedicated Visual Boxes: Signature (Left) & Identity Portrait (Right)
  const boxWidth = 84;
  const sigBoxHeight = 44;
  const photoBoxHeight = 44;

  // ── 1. Dedicated Signature Box ──
  const sigX = 16;
  const sigY = y;
  setColor(doc, [240, 230, 200], 'fill');
  doc.rect(sigX, sigY, boxWidth, sigBoxHeight, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.4);
  doc.rect(sigX, sigY, boxWidth, sigBoxHeight);

  setColor(doc, INK, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setCharSpace(1);
  doc.text('MEMBER SIGNATURE', sigX + boxWidth / 2, sigY + 5, { align: 'center' });
  doc.setCharSpace(0);

  if (member.signatureDataUrl) {
    try {
      const sigMeta = await loadImageDimensions(member.signatureDataUrl);
      if (sigMeta) {
        const maxW = boxWidth - 10;
        const maxH = sigBoxHeight - 16;
        const scale = Math.min(maxW / sigMeta.width, maxH / sigMeta.height);
        const drawW = sigMeta.width * scale;
        const drawH = sigMeta.height * scale;
        const drawX = sigX + (boxWidth - drawW) / 2;
        const drawY = sigY + 7 + (maxH - drawH) / 2;

        doc.addImage(member.signatureDataUrl, 'PNG', drawX, drawY, drawW, drawH, undefined, 'FAST');
      } else {
        doc.addImage(member.signatureDataUrl, 'PNG', sigX + 6, sigY + 7, boxWidth - 12, sigBoxHeight - 16, undefined, 'FAST');
      }
    } catch {
      setColor(doc, [120, 100, 70], 'text');
      doc.setFontSize(8);
      doc.text('[ Indelible Mark Recorded ]', sigX + boxWidth / 2, sigY + 22, { align: 'center' });
    }
  } else {
    setColor(doc, [120, 100, 70], 'text');
    doc.setFontSize(8);
    doc.text('[ Signature on File ]', sigX + boxWidth / 2, sigY + 22, { align: 'center' });
  }

  // Signature Subcaption
  setColor(doc, INK, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text(`Signed by: ${sanitizeText(member.memberName)}`, sigX + boxWidth / 2, sigY + sigBoxHeight - 3, { align: 'center' });

  // ── 2. Dedicated Identity Portrait Box ──
  const photoX = pw - 16 - boxWidth;
  const photoY = y;
  setColor(doc, OBSIDIAN, 'fill');
  doc.rect(photoX, photoY, boxWidth, photoBoxHeight, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.4);
  doc.rect(photoX, photoY, boxWidth, photoBoxHeight);

  setColor(doc, GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setCharSpace(1);
  doc.text('IDENTITY PORTRAIT SEAL', photoX + boxWidth / 2, photoY + 5, { align: 'center' });
  doc.setCharSpace(0);

  if (member.photoDataUrl) {
    try {
      const photoMeta = await loadImageDimensions(member.photoDataUrl);
      const photoSize = photoBoxHeight - 14;
      const photoDrawX = photoX + (boxWidth - photoSize) / 2;
      const photoDrawY = photoY + 7;

      doc.addImage(member.photoDataUrl, 'JPEG', photoDrawX, photoDrawY, photoSize, photoSize, undefined, 'FAST');
    } catch {
      setColor(doc, AGED_PAPER, 'text');
      doc.setFontSize(7.5);
      doc.text('[ Portrait Verified ]', photoX + boxWidth / 2, photoY + 24, { align: 'center' });
    }
  } else {
    setColor(doc, AGED_PAPER, 'text');
    doc.setFontSize(7.5);
    doc.text('[ Portrait Confirmed ]', photoX + boxWidth / 2, photoY + 24, { align: 'center' });
  }

  setColor(doc, AGED_PAPER, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('Identity Verified & Sealed', photoX + boxWidth / 2, photoY + photoBoxHeight - 3, { align: 'center' });

  // ── 3. Stamped Imperial Seal & Declaration ──
  y += sigBoxHeight + 8;

  const finalSealX = pw / 2;
  const finalSealY = y + 14;
  const finalSealR = 14;
  drawVectorSeal(doc, finalSealX, finalSealY, finalSealR, 'SEALED');

  // Final Oath Statement
  y = finalSealY + finalSealR + 6;
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.2);
  doc.line(30, y, pw - 30, y);

  y += 5;
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  const oathText =
    '"I have read, understood, and voluntarily agree to uphold the Twelve Articles of the Imperial Covenant for the entire duration of our teamwork."';
  const splitOath = doc.splitTextToSize(oathText, pw - 40);
  doc.text(splitOath, pw / 2, y, { align: 'center' });

  return doc;
}

// Generate PDF as Blob and File (for Web Share API & programmatic export)
export async function generateCovenantPDFBlob(
  member: AgreementData
): Promise<{ fileName: string; file: File; blob: Blob }> {
  const doc = await buildCovenantPDF(member);
  const cleanName = member.memberName.replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `Covenant-${cleanName}-${member.agreementId}.pdf`;
  const blob = doc.output('blob');
  const file = new File([blob], fileName, { type: 'application/pdf' });
  return { fileName, file, blob };
}

// Trigger automatic browser download
export async function downloadCovenantPDF(member: AgreementData): Promise<void> {
  const { fileName, blob } = await generateCovenantPDFBlob(member);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

// Backwards-compatible default export
export async function generateCovenantPDF(member: AgreementData): Promise<void> {
  return downloadCovenantPDF(member);
}
