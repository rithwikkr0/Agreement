// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Hardened Storage Service
// ═══════════════════════════════════════════════════

import type { AgreementData } from './agreement';
export type { AgreementData };

const STORAGE_KEY = 'imperial_covenant_members_v1';
const CURRENT_SESSION_KEY = 'imperial_covenant_session_v1';

export interface SigningSessionState {
  step: number;
  name: string;
  role: string;
  signatureDataUrl?: string;
  photoDataUrl?: string;
  agreedToOath: boolean;
}

// Load all sealed members safely
export function loadMembers(): AgreementData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item) => item && typeof item.memberName === 'string');
    }
    return [];
  } catch (err) {
    console.warn('Failed to load members from localStorage:', err);
    return [];
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
  const members = loadMembers();
  const idx = members.findIndex((m) => m.memberId === member.memberId || m.agreementId === member.agreementId);
  if (idx >= 0) {
    members[idx] = member;
  } else {
    if (members.length >= 10) {
      console.warn('Registry full. Maximum 10 members allowed.');
      return false;
    }
    members.push(member);
  }
  return saveMembers(members);
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

// Reset all application data (with user confirmation)
export function resetAllData(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CURRENT_SESSION_KEY);
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
