// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Local Storage Service
//  Uses localStorage for simplicity (IndexedDB optional)
// ═══════════════════════════════════════════════════

import type { AgreementData } from './agreement';
export type { AgreementData };

const STORAGE_KEY = 'imperial_covenant_members';
const CURRENT_MEMBER_KEY = 'imperial_covenant_current';

// Save all members
export function saveMembers(members: AgreementData[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (err) {
    console.error('Failed to save members:', err);
  }
}

// Load all members
export function loadMembers(): AgreementData[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as AgreementData[];
  } catch {
    return [];
  }
}

// Add or update a member
export function upsertMember(member: AgreementData): void {
  const members = loadMembers();
  const idx = members.findIndex(m => m.memberId === member.memberId);
  if (idx >= 0) {
    members[idx] = member;
  } else {
    members.push(member);
  }
  saveMembers(members);
}

// Get a single member by ID
export function getMember(memberId: string): AgreementData | null {
  const members = loadMembers();
  return members.find(m => m.memberId === memberId) ?? null;
}

// Save current signing session
export function saveCurrentSession(data: Partial<AgreementData>): void {
  try {
    localStorage.setItem(CURRENT_MEMBER_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

// Load current session
export function loadCurrentSession(): Partial<AgreementData> | null {
  try {
    const raw = localStorage.getItem(CURRENT_MEMBER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<AgreementData>;
  } catch {
    return null;
  }
}

// Clear current session
export function clearCurrentSession(): void {
  localStorage.removeItem(CURRENT_MEMBER_KEY);
}

// Reset ALL data (with user confirmation required by caller)
export function resetAllData(): void {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(CURRENT_MEMBER_KEY);
}

// Export members as JSON
export function exportMembersJSON(): string {
  const members = loadMembers();
  return JSON.stringify(members, null, 2);
}

// Count sealed members
export function countSealed(): number {
  return loadMembers().filter(m => m.status === 'sealed').length;
}
