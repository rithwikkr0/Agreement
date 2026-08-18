// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Agreement Service
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

// Generate a unique agreement ID
export function generateAgreementId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `TC-${timestamp}${random}`;
}

// Generate a deterministic seal color from name
export function generateSealColor(name: string): string {
  const colors = [
    '#7A1717', // ancient-red
    '#1D3930', // dark-jade
    '#74532B', // bronze
    '#2C1810', // dark brown
    '#1A2C3D', // deep blue
    '#3D1A2C', // deep purple-red
    '#1A3D2C', // forest
    '#2C3D1A', // olive
    '#3D2C1A', // amber-dark
    '#1A1A3D', // midnight
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Format date in imperial style
export function formatImperialDate(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatImperialTime(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}
