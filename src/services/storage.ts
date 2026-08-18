// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Hardened Storage Service
// ═══════════════════════════════════════════════════

import type { AgreementData } from './agreement';
export type { AgreementData };

const STORAGE_KEY = 'imperial_covenant_members_v2';
const CURRENT_SESSION_KEY = 'imperial_covenant_session_v2';

export interface SigningSessionState {
  step: number;
  name: string;
  role: string;
  signatureDataUrl?: string;
  photoDataUrl?: string;
  agreedToOath: boolean;
}

// Leader only (no placeholder members)
export const defaultFoundingMembers: AgreementData[] = [
  {
    memberId: 'mem_leader_rithwik',
    memberName: 'Rithwik',
    role: 'Keeper of the Covenant / Team Leader',
    agreementId: 'TC-26-RTWK01A8',
    timestamp: new Date().toISOString(),
    status: 'sealed',
    sealColor: '#7A1717',
  },
];

// Load all sealed members
export function loadMembers(): AgreementData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveMembers(defaultFoundingMembers);
      return defaultFoundingMembers;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.filter((item) => item && typeof item.memberName === 'string' && item.status === 'sealed');
    }
    saveMembers(defaultFoundingMembers);
    return defaultFoundingMembers;
  } catch (err) {
    console.warn('Failed to load members from localStorage:', err);
    return defaultFoundingMembers;
  }
}

// Save all sealed members safely
export function saveMembers(members: AgreementData[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    return true;
  } catch (err) {
    console.error('Failed to save members to localStorage:', err);
    return false;
  }
}

// Upsert a member (enforcing max 10 members limit)
export function upsertMember(member: AgreementData): boolean {
  if (!member || !member.memberName) return false;
  const members = loadMembers();
  const idx = members.findIndex(
    (m) =>
      m.memberId === member.memberId ||
      m.agreementId === member.agreementId ||
      m.memberName.toLowerCase().trim() === member.memberName.toLowerCase().trim()
  );
  if (idx >= 0) {
    members[idx] = { ...members[idx], ...member, status: 'sealed' };
  } else {
    if (members.length >= 10) {
      console.warn('Registry full. Maximum 10 members allowed.');
      return false;
    }
    members.push({ ...member, status: 'sealed' });
  }
  return saveMembers(members);
}

// Import a single member with status feedback
export function importSingleMember(member: AgreementData): { success: boolean; isNew: boolean; message: string } {
  if (!member || !member.memberName || !member.agreementId) {
    return { success: false, isNew: false, message: 'Invalid member seal payload.' };
  }

  const members = loadMembers();
  const existingIdx = members.findIndex(
    (m) =>
      m.agreementId === member.agreementId ||
      m.memberName.toLowerCase().trim() === member.memberName.toLowerCase().trim()
  );

  if (existingIdx >= 0) {
    members[existingIdx] = { ...members[existingIdx], ...member, status: 'sealed' };
    saveMembers(members);
    return { success: true, isNew: false, message: `Updated member record for ${member.memberName}.` };
  }

  if (members.length >= 10) {
    return { success: false, isNew: false, message: 'Covenant Registry is full (10/10 members).' };
  }

  members.push({ ...member, status: 'sealed' });
  saveMembers(members);
  return { success: true, isNew: true, message: `Added ${member.memberName} to the Covenant Registry!` };
}

// Import multiple members (for bulk sync)
export function importMultipleMembers(incoming: AgreementData[]): { addedCount: number; updatedCount: number } {
  let addedCount = 0;
  let updatedCount = 0;

  incoming.forEach((member) => {
    const result = importSingleMember(member);
    if (result.success) {
      if (result.isNew) addedCount++;
      else updatedCount++;
    }
  });

  return { addedCount, updatedCount };
}

// Get single member by ID
export function getMember(memberId: string): AgreementData | null {
  const members = loadMembers();
  return members.find((m) => m.memberId === memberId || m.agreementId === memberId) ?? null;
}

// Save active multi-step signing session
export function saveCurrentSession(session: SigningSessionState): void {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
  } catch (err) {
    console.warn('Could not save signing session:', err);
  }
}

// Load active multi-step signing session
export function loadCurrentSession(): SigningSessionState | null {
  try {
    const raw = localStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SigningSessionState;
  } catch {
    return null;
  }
}

// Clear active signing session
export function clearCurrentSession(): void {
  try {
    localStorage.removeItem(CURRENT_SESSION_KEY);
  } catch {}
}

// Reset all application data back to leader only
export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_SESSION_KEY);
    saveMembers(defaultFoundingMembers);
  } catch (err) {
    console.warn('Reset error:', err);
  }
}

// Export members registry as JSON string
export function exportMembersJSON(): string {
  const members = loadMembers();
  return JSON.stringify(
    {
      covenant: 'The Imperial Covenant',
      exportedAt: new Date().toISOString(),
      memberCount: members.length,
      members,
    },
    null,
    2
  );
}

// Count sealed members
export function countSealed(): number {
  return loadMembers().filter((m) => m.status === 'sealed').length;
}
