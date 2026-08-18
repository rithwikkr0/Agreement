# 🏯 THE IMPERIAL COVENANT

> **A Formal Charter of Teamwork, Responsibility & Trust**  
> *An ancient imperial decree transformed into a futuristic 3D digital team charter.*

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![Deploy](https://github.com/rithwikkr0/Agreement/actions/workflows/deploy.yml/badge.svg)](https://github.com/rithwikkr0/Agreement/actions/workflows/deploy.yml)
[![Hosting Cost](https://img.shields.io/badge/Hosting%20Cost-₹0%20%2F%20%240-brightgreen.svg)]()

---

## 🌟 Project Overview

**The Imperial Covenant** is a ceremonial digital team agreement inspired by ancient Chinese and Korean imperial royal decrees, silk scrolls, and cinnabar wax seals. It transforms formal team rules and accountability into an interactive web experience featuring:

* 🌌 **3D Procedural Environment** — Floating gold dust particles, mountain silhouettes, palace outline, atmospheric mist, and lanterns built with Three.js & React Three Fiber.
* 📜 **Imperial Silk Scroll** — Unfurling parchment containing the **Twelve Articles of Responsibility**.
* 👑 **Keeper of the Covenant** — Leadership section establishing team coordination and guidance principles.
* 🗃️ **Member Roll of Honour** — 4 to 10 member registry with wax seals and progress tracking.
* ✍️ **Ritual Signing Ceremony** — 5-step ritual with parchment signature pad (touch/mouse/stylus), camera portrait capture, and verification.
* 🖨️ **3-Page Certificate PDF Generator** — Free in-browser PDF generation with member signatures and seals.
* 📱 **Native Web Share & Download** — Instant distribution on mobile and desktop without cloud dependencies.
* 🔒 **100% Client-Side Privacy** — Zero paid servers, zero external databases, zero trackers. ₹0 / $0 to host and run.

---

## 🎨 Design Philosophy & Palette

| Element | Hex Code | Purpose |
|---|---|---|
| **Ink Black** | `#090806` | Deep ancient calligraphy ink background |
| **Obsidian** | `#12100C` | Atmospheric shadows and layered depth |
| **Ancient Red** | `#7A1717` | Imperial decree borders and authority accents |
| **Vermilion** | `#B52B21` | Cinnabar wax seals and primary action buttons |
| **Imperial Gold** | `#C89B3C` | Royal trim, ornamental filigree, and highlights |
| **Bright Gold** | `#F0D27A` | Shimmer text and active indicators |
| **Jade** | `#567A64` | Verified status badges and seal flourishes |
| **Aged Paper** | `#DCC38E` | Parchment texture and body readability |
| **Ivory** | `#F5E8C6` | Primary high-contrast text |
| **Bronze** | `#74532B` | Scroll rods and structure dividers |

---

## 🛠️ Technology Stack (All Free & Open Source)

* **Framework:** React 18 + TypeScript + Vite
* **Styling:** Vanilla Tailwind CSS + Custom Imperial CSS
* **3D Visuals:** Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei`
* **Icons:** Lucide React
* **PDF Export:** jsPDF + html2canvas
* **Typography:** Google Fonts (*Cinzel*, *Cinzel Decorative*, *Noto Serif*, *Noto Sans*)
* **Storage:** In-browser `localStorage`
* **Hosting & CI/CD:** GitHub Pages + GitHub Actions

---

## 🚀 Getting Started Locally

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* `npm` (v9 or higher)

### 1. Clone the repository
```bash
git clone https://github.com/rithwikkr0/Agreement.git
cd Agreement
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
Open [http://localhost:5173/Agreement/](http://localhost:5173/Agreement/) in your browser.

### 4. Build production bundle
```bash
npm run build
```

### 5. Preview production build locally
```bash
npm run preview
```

---

## ⚙️ Customization & Team Configuration

Edit `src/config/team.ts` to customize your team's charter:

```typescript
export const teamConfig = {
  teamName: "The Covenant",
  leaderName: "Rithwik",                  // Team leader name
  leaderTitle: "Keeper of the Covenant",
  leaderAuthority: "By the authority vested herein, the Keeper may assign roles, coordinate timelines, and guide the team toward excellence.",
  projectName: "Project Covenant",
  maximumMembers: 10,                    // 4 to 10 members
  minimumMembers: 4,
  covenantVersion: "I",
  covenantYear: 2026,
};
```

---

## 📜 The Twelve Articles

1. **Article I — Leadership (`令`):** Stewardship and role assignment by the Keeper.
2. **Article II — Responsibility (`任`):** Duty to complete assignments on time and to standard.
3. **Article III — Discipline (`律`):** Resolving differences with reason and avoiding unnecessary disputes.
4. **Article IV — No Unfair Comparison (`公`):** Every contribution serves the greater vision.
5. **Article V — Deadlines (`期`):** Proactive communication before milestones pass.
6. **Article VI — Presentations (`発`):** Readiness to represent personal contributions.
7. **Article VII — Quality (`質`):** Work must be tested, original, and complete.
8. **Article VIII — Accountability (`責`):** Mutual accountability and consequence for negligence.
9. **Article IX — Confidentiality (`密`):** Protecting internal discussions and project assets.
10. **Article X — Team Respect (`敬`):** Zero tolerance for harassment or discrimination.
11. **Article XI — Integrity (`誠`):** No compromise on academic and personal ethics.
12. **Article XII — The Final Oath (`誓`):** Voluntary agreement binding the signatory to the charter.

---

## 🔒 Privacy, Security & Data Sovereignty

* **No Cloud Database Required:** All member records, signatures, and portraits are processed and saved solely inside the local browser storage.
* **Camera Access:** Requested exclusively when taking an identity portrait. Can be skipped or replaced with an image file upload.
* **PDF Export:** Rendered client-side using jsPDF without transmitting data to any server.
* **Reset Data:** The Admin Dashboard allows instant local purging of all records.

---

## 🚀 GitHub Pages Deployment

This repository includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

### Enable GitHub Pages in your Repository:
1. Go to your GitHub repository **Settings** → **Pages**.
2. Under **Build and deployment** > **Source**, select **GitHub Actions**.
3. Push any commit to the `main` branch. GitHub Actions will automatically build and publish the site.
4. Access your live covenant at:  
   👉 **`https://rithwikkr0.github.io/Agreement/`**

---

## ⚖️ Legal Disclaimer

> *"This is an internal team working charter and is not a substitute for a legal agreement."*

---

## 📜 License

MIT License — Free to use, adapt, and distribute for any private, academic, or professional team.
