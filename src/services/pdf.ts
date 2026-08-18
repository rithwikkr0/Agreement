// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — PDF Generation Service
// ═══════════════════════════════════════════════════

import jsPDF from 'jspdf';
import { articles } from '../data/covenant';
import { formatImperialDate, formatImperialTime, type AgreementData } from './agreement';

// Imperial color constants (RGB)
const INK = [9, 8, 6] as const;
const GOLD = [200, 155, 60] as const;
const RED = [122, 23, 23] as const;
const IVORY = [245, 232, 198] as const;
const AGED_PAPER = [220, 195, 142] as const;
const VERMILION = [181, 43, 33] as const;

function setColor(doc: jsPDF, rgb: readonly [number, number, number], type: 'fill' | 'text' | 'draw' = 'fill') {
  if (type === 'fill') doc.setFillColor(rgb[0], rgb[1], rgb[2]);
  else if (type === 'text') doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  else doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
}

export async function generateCovenantPDF(member: AgreementData): Promise<void> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pw = doc.internal.pageSize.getWidth();
  const ph = doc.internal.pageSize.getHeight();
  let y = 0;

  // ── PAGE 1: COVER ──────────────────────────────────
  // Background
  setColor(doc, INK, 'fill');
  doc.rect(0, 0, pw, ph, 'F');

  // Outer gold border
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.8);
  doc.rect(8, 8, pw - 16, ph - 16);
  doc.setLineWidth(0.3);
  doc.rect(11, 11, pw - 22, ph - 22);

  // Top decorative band
  setColor(doc, RED, 'fill');
  doc.rect(0, 0, pw, 18, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.5);
  doc.line(0, 18, pw, 18);

  // Header text in band
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setCharSpace(3);
  doc.text('THE IMPERIAL COVENANT  ◈  OFFICIAL RECORD', pw / 2, 11, { align: 'center' });
  doc.setCharSpace(0);

  // Decorative corner ornaments
  const corners = [[15, 22], [pw - 15, 22], [15, ph - 22], [pw - 15, ph - 22]] as const;
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.5);
  corners.forEach(([cx, cy], i) => {
    const sx = i % 2 === 0 ? 1 : -1;
    const sy = i < 2 ? 1 : -1;
    doc.line(cx, cy, cx + sx * 8, cy);
    doc.line(cx, cy, cx, cy + sy * 8);
  });

  // Main seal circle
  const sealX = pw / 2;
  const sealY = 85;
  const sealR = 28;
  setColor(doc, [122, 23, 23], 'fill');
  doc.circle(sealX, sealY, sealR, 'F');
  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(1);
  doc.circle(sealX, sealY, sealR);
  doc.setLineWidth(0.3);
  doc.circle(sealX, sealY, sealR - 3);
  // Diamond
  doc.lines([
    [sealR * 0.7, 0], [0, sealR * 0.7], [-sealR * 0.7, 0], [0, -sealR * 0.7]
  ], sealX - sealR * 0.7, sealY, [1, 1], 'S', true);

  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('盟', sealX, sealY + 6, { align: 'center' });

  // Title
  y = 128;
  setColor(doc, GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setCharSpace(4);
  doc.text('THE IMPERIAL', pw / 2, y, { align: 'center' });
  y += 12;
  doc.text('COVENANT', pw / 2, y, { align: 'center' });
  doc.setCharSpace(0);

  y += 8;
  setColor(doc, AGED_PAPER, 'draw');
  doc.setLineWidth(0.3);
  doc.line(30, y, pw - 30, y);

  y += 8;
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('A Formal Charter of Teamwork, Responsibility & Trust', pw / 2, y, { align: 'center' });

  y += 20;
  setColor(doc, AGED_PAPER, 'draw');
  doc.setLineWidth(0.3);
  doc.line(40, y, pw - 40, y);

  // Member info block
  y += 12;
  setColor(doc, GOLD, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setCharSpace(2);
  doc.text('SEALED BY', pw / 2, y, { align: 'center' });
  doc.setCharSpace(0);

  y += 8;
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text(member.memberName, pw / 2, y, { align: 'center' });

  y += 7;
  setColor(doc, GOLD, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(member.role || 'Member', pw / 2, y, { align: 'center' });

  y += 12;
  setColor(doc, AGED_PAPER, 'draw');
  doc.setLineWidth(0.2);
  doc.line(40, y, pw - 40, y);

  y += 8;
  setColor(doc, IVORY, 'text');
  doc.setFontSize(8);
  doc.text(`Agreement ID: ${member.agreementId}`, pw / 2, y, { align: 'center' });
  y += 6;
  doc.text(`Date: ${formatImperialDate(member.timestamp)}  ·  ${formatImperialTime(member.timestamp)}`, pw / 2, y, { align: 'center' });
  y += 6;
  setColor(doc, [86, 122, 100], 'text');
  doc.setFont('helvetica', 'bold');
  doc.text('STATUS: SEALED & AGREED', pw / 2, y, { align: 'center' });

  // Bottom band
  setColor(doc, RED, 'fill');
  doc.rect(0, ph - 14, pw, 14, 'F');
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setCharSpace(1);
  doc.text('This is an internal team working charter and is not a substitute for a legal agreement.', pw / 2, ph - 6, { align: 'center' });
  doc.setCharSpace(0);

  // ── PAGE 2: ARTICLES ───────────────────────────────
  doc.addPage();
  setColor(doc, [14, 12, 9], 'fill');
  doc.rect(0, 0, pw, ph, 'F');

  setColor(doc, RED, 'fill');
  doc.rect(0, 0, pw, 15, 'F');
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setCharSpace(3);
  doc.text('THE TWELVE ARTICLES OF THE IMPERIAL COVENANT', pw / 2, 9, { align: 'center' });
  doc.setCharSpace(0);

  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.5);
  doc.rect(8, 18, pw - 16, ph - 26);

  y = 28;
  articles.forEach((art, idx) => {
    if (y > ph - 30) {
      doc.addPage();
      setColor(doc, [14, 12, 9], 'fill');
      doc.rect(0, 0, pw, ph, 'F');
      y = 18;
    }

    // Article number
    setColor(doc, GOLD, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setCharSpace(2);
    doc.text(`ARTICLE ${art.romanNumeral}`, 18, y);
    doc.setCharSpace(0);

    y += 5;
    setColor(doc, VERMILION, 'text');
    doc.setFontSize(11);
    doc.text(art.title.toUpperCase(), 18, y);

    y += 4;
    setColor(doc, [200, 155, 60, 0.5].slice(0, 3) as [number,number,number], 'draw');
    doc.setLineWidth(0.2);
    doc.line(18, y, pw - 18, y);

    y += 5;
    setColor(doc, IVORY, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    const lines = doc.splitTextToSize(art.text, pw - 40);
    doc.text(lines, 18, y);
    y += lines.length * 4 + 6;

    if (idx < articles.length - 1) {
      setColor(doc, [40, 35, 25], 'draw');
      doc.setLineWidth(0.1);
      doc.line(18, y - 3, pw - 18, y - 3);
    }
  });

  // ── PAGE 3: MEMBER RECORD ─────────────────────────
  doc.addPage();
  setColor(doc, [14, 12, 9], 'fill');
  doc.rect(0, 0, pw, ph, 'F');

  setColor(doc, RED, 'fill');
  doc.rect(0, 0, pw, 15, 'F');
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setCharSpace(3);
  doc.text('MEMBER RECORD & SIGNATURE', pw / 2, 9, { align: 'center' });
  doc.setCharSpace(0);

  setColor(doc, GOLD, 'draw');
  doc.setLineWidth(0.5);
  doc.rect(8, 18, pw - 16, ph - 26);

  y = 28;

  // Member info
  setColor(doc, GOLD, 'text');
  doc.setFontSize(8);
  doc.setCharSpace(2);
  doc.text('COVENANT MEMBER', pw / 2, y, { align: 'center' });
  doc.setCharSpace(0);

  y += 8;
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(member.memberName, pw / 2, y, { align: 'center' });

  y += 7;
  setColor(doc, AGED_PAPER, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(member.role || 'Team Member', pw / 2, y, { align: 'center' });

  y += 10;
  setColor(doc, AGED_PAPER, 'draw');
  doc.setLineWidth(0.3);
  doc.line(25, y, pw - 25, y);

  // Details grid
  y += 10;
  const labelX = 20;
  const valX = 80;
  const lineHeight = 8;

  const details = [
    ['Agreement ID', member.agreementId],
    ['Date Sealed', formatImperialDate(member.timestamp)],
    ['Time Sealed', formatImperialTime(member.timestamp)],
    ['Status', 'SEALED & AGREED'],
  ];

  details.forEach(([label, val]) => {
    setColor(doc, GOLD, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setCharSpace(1);
    doc.text(label.toUpperCase(), labelX, y);
    doc.setCharSpace(0);
    setColor(doc, IVORY, 'text');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(val, valX, y);
    y += lineHeight;
  });

  y += 5;
  setColor(doc, AGED_PAPER, 'draw');
  doc.setLineWidth(0.2);
  doc.line(25, y, pw - 25, y);

  // Signature
  if (member.signatureDataUrl) {
    y += 10;
    setColor(doc, GOLD, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setCharSpace(2);
    doc.text('SIGNATURE', pw / 2, y, { align: 'center' });
    doc.setCharSpace(0);

    y += 5;
    // Signature box background
    setColor(doc, [240, 228, 192], 'fill');
    doc.rect(20, y, pw - 40, 35, 'F');
    setColor(doc, [200, 155, 60], 'draw');
    doc.setLineWidth(0.5);
    doc.rect(20, y, pw - 40, 35);

    try {
      doc.addImage(member.signatureDataUrl, 'PNG', 22, y + 2, pw - 44, 31);
    } catch {
      setColor(doc, [150, 120, 80], 'text');
      doc.setFontSize(8);
      doc.text('[ Signature on file ]', pw / 2, y + 18, { align: 'center' });
    }
    y += 45;
  }

  // Photo
  if (member.photoDataUrl) {
    y += 5;
    setColor(doc, GOLD, 'text');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    doc.setCharSpace(2);
    doc.text('IDENTITY SEAL', pw / 2, y, { align: 'center' });
    doc.setCharSpace(0);

    y += 5;
    const photoSize = 50;
    const photoX = (pw - photoSize) / 2;
    setColor(doc, GOLD, 'draw');
    doc.setLineWidth(0.5);
    doc.rect(photoX - 2, y - 2, photoSize + 4, photoSize + 4);

    try {
      doc.addImage(member.photoDataUrl, 'JPEG', photoX, y, photoSize, photoSize);
    } catch {
      setColor(doc, [100, 80, 50], 'text');
      doc.setFontSize(8);
      doc.text('[ Photo on file ]', pw / 2, y + 25, { align: 'center' });
    }
    y += photoSize + 15;
  }

  // Oath statement
  y = Math.max(y, ph - 60);
  setColor(doc, AGED_PAPER, 'draw');
  doc.setLineWidth(0.2);
  doc.line(25, y, pw - 25, y);

  y += 8;
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(8);
  const oath = '"I have read and understood this Covenant, and I voluntarily agree to uphold its principles for the duration of the project."';
  const oathLines = doc.splitTextToSize(oath, pw - 50);
  doc.text(oathLines, pw / 2, y, { align: 'center' });

  // Bottom band
  setColor(doc, RED, 'fill');
  doc.rect(0, ph - 14, pw, 14, 'F');
  setColor(doc, IVORY, 'text');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.setCharSpace(0.5);
  doc.text('This is an internal team working charter and is not a substitute for a legal agreement.', pw / 2, ph - 6, { align: 'center' });

  // Save
  const fileName = `Covenant-${member.memberName.replace(/\s+/g, '-')}-${member.agreementId}.pdf`;
  doc.save(fileName);
}
