// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Team Configuration
// ═══════════════════════════════════════════════════

export const teamConfig = {
  teamName: "The Covenant",
  leaderName: "Rithwik",
  leaderTitle: "Keeper of the Covenant",
  leaderAuthority: "By the authority vested herein, the Keeper may assign roles, coordinate timelines, and guide the team toward excellence.",
  projectName: "Project Covenant",
  maximumMembers: 10,
  minimumMembers: 4,
  covenantVersion: "I",
  covenantYear: new Date().getFullYear(),
  foundingMembers: [
    "Rithwik"
  ],
};

export type TeamConfig = typeof teamConfig;
