// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Agreement Service & Types
// ═══════════════════════════════════════════════════

export interface AgreementData {
  memberId: string;
  memberName: string;
  role: string;
  agreementId: string;
  timestamp: string;
  status: 'sealed' | 'pending';
  signatureDataUrl?: string;
  photoDataUrl?: string;
  sealColor: string;
}

// Generate a deterministic and authentic imperial agreement ID
export function generateAgreementId(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  for (let i = 0; i < 6; i++) {
    randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const timeHex = Date.now().toString(36).toUpperCase().slice(-4);
  return `TC-${year}-${randomPart}${timeHex}`;
}

// Deterministic royal seal color derived from member name
export function generateSealColor(name: string): string {
  const colors = [
    '#7A1717', // ancient-red
    '#1D3930', // dark-jade
    '#74532B', // bronze
    '#2C1810', // dark brown
    '#1A2C3D', // deep royal blue
    '#3D1A2C', // deep imperial purple
    '#1A3D2C', // deep forest jade
    '#2C3D1A', // deep olive
    '#3D2C1A', // deep amber
    '#1A1A3D', // midnight indigo
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Imperial Date & Time Formatters
export function formatImperialDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoString;
  }
}

export function formatImperialTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  } catch {
    return '';
  }
}

// Client-side image resizing & optimization helper
export async function optimizeImage(
  dataUrl: string,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve) => {
    if (!dataUrl || !dataUrl.startsWith('data:image')) {
      resolve(dataUrl);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(dataUrl);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}
