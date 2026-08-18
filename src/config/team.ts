// ═══════════════════════════════════════════════════
//  IMPERIAL COVENANT — Team Configuration
//  Edit this file to customize the team details
// ═══════════════════════════════════════════════════

export const teamConfig = {
  teamName: "The Covenant",
  leaderName: "Rithwik",          // Change to actual leader name
  leaderTitle: "Keeper of the Covenant",
  leaderAuthority: "By the authority vested herein, the Keeper may assign roles, coordinate timelines, and guide the team toward excellence.",
  projectName: "Project Covenant",
  maximumMembers: 10,
  minimumMembers: 4,
  covenantVersion: "I",           // Roman numeral version
  covenantYear: new Date().getFullYear(),
  // Founding members (pre-configured); leave empty [] for fully dynamic
  foundingMembers: [] as string[],
};

export type TeamConfig = typeof teamConfig;
