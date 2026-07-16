# PsyNova Sri Lanka — Hero Design Spec & Assets

This document contains the visual layout design, color system, typography rules, signature hero concept wireframe, and a reusable build prompt for future developers or AI tools.

---

## 🎨 Color System (PsyNova Slate Theme)
A premium palette designed to be calm, trustworthy, and human, intentionally avoiding the clinical "light teal/cream" defaults or "cyberpunk/neon" gamified looks.

| Token Name | Hex Code | Visual Application |
| :--- | :--- | :--- |
| **Ink Navy** | `#0A1128` | Deep midnight canvas background, solid medical-grade foundation. |
| **Ink Muted** | `#1C2541` | Soft slate background for bento cards, lists, and modal bodies. |
| **Warm Turmeric** | `#ECC09B` | High-importance action buttons, active hover states, and key highlights. |
| **Sage** | `#8DAA9D` | Restorative, soft-green indicators for medical verification and safety alerts. |
| **Paper** | `#F4F5F6` | High-contrast readability color for primary descriptions and texts. |
| **Blush** | `#F2D5D5` | Soft organic pink accents representing mental equilibrium and empathy. |

---

## 🔤 Typography Strategy
*   **English Display & Headings:** `Fraunces` (Muted, warm serif for premium editorial feel).
*   **English Body Text:** `Inter` or `IBM Plex Sans` (Highly legible sans-serif for medical parameters).
*   **Sinhala Local Script Support:** `Noto Sans Sinhala` (Required for genuine native script rendering).
*   **Tamil Local Script Support:** `Noto Sans Tamil` (Required for genuine native script rendering).

---

## 🌊 Signature Hero Concept: "The Calming Shoreline"
*“The Calming Shoreline”* replaces standard brain/lotus icons with an elegant metaphor matching Sri Lanka's geography:
1.  **Left Margin (High Stress):** Starts as a jagged, erratic, high-frequency spark line.
2.  **Middle/Transition:** Smooths out gradually via cubic bezier curve modeling.
3.  **Right Margin (The Calming Wave):** Resolves into a beautiful, rhythmic, therapeutic ocean shore wave.

### 📐 ASCII Layout Wireframe
```text
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   [ Brand Logo ]  PsyNova                  [ Home ]  [ About ]  [ Support ]  [ Globe v ] [Login] |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   WELCOME TO PSYNOVA                                                                            |
|   The [ Healthy ] Mind Is A Wealthy Soul                                                        |
|                                                                                                 |
|   +-- "The Calming Shoreline" Metaphor Vector -----------------------------------------------+  |
|   |                                                                                           |  |
|   |  /\__/\_                                                                                  |  |
|   |         \/\___/\_                                                                         |  |
|   |                  \________/\___________/\____________/\____________/\___________          |  |
|   |                                                                                           |  |
|   |  [ high stress / ලැදියාව ]                      [ calming shoreline / සන්සුන් වෙරළ ]        |  |
|   +-------------------------------------------------------------------------------------------+  |
|                                                                                                 |
|   [ Enter Specialist Name / District... ]                          [ Search / සොයන්න ]         |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
|                                                                                                 |
|   [ 25+ Years Exp ]               [ 7.8K+ Happy Souls ]            [ 100% SLMC Verified ]       |
|                                                                                                 |
+-------------------------------------------------------------------------------------------------+
```

---

## 🚀 Ready-to-Use Hero Build Prompt
This prompt is formatted to be copied and pasted directly into any AI code generator or given to a developer to build or modify this specific header:

```markdown
Build a premium, single-view tele-psychiatry hero section for "PsyNova Sri Lanka" adhering to a high-contrast dark visual design.

1. LAYOUT: Split into a balanced 2-column container. Left column contains a block with high-tracking uppercase turmeric text "WELCOME TO PSYNOVA", followed by a lightweight light font headline "The [Healthy] Mind Is A Wealthy Soul" where the word "Healthy" is wrapped in a thick, rounded warm turmeric background badge with dark navy text. Below the headline, embed a vector visualization box titled "The Calming Shoreline" displaying an SVG path that transitions smoothly from jagged zigzag peaks (high-stress representation) on the left into a smooth rhythmic wave (therapeutic balance) on the right. Below this vector, place a district-based drop-down search and specialist input bar.
2. COLORS & STYLING:
   - Primary Canvas background: Deep Ink Navy (`#0A1128`)
   - Card/Metaphor box: Muted Slate Ink Muted (`#1C2541`)
   - Action highlights & primary buttons: Warm Turmeric (`#ECC09B`)
   - Empathy highlights & indicators: Blush (`#F2D5D5`)
3. TYPOGRAPHY:
   - Use Fraunces Google Font for all display headlines.
   - Use Inter/Plex Sans for labels, body descriptions, and search input terms.
   - Force real-script multi-lingual rendering fallback using "Noto Sans Sinhala" and "Noto Sans Tamil" on all Sri Lankan labels.
4. INTERACTIVITY: Provide responsive hover scale on search elements, pulsing stroke animation along the shoreline SVG, and clean focus ring inputs.
```

---

## 📦 Deliverables Note & Audit
All visual elements, modals (Client Register, Payment Gateway, Psychiatrist Consultation, and Complaint/Dispute panels) have been audited and updated to respect the exact visual design guidelines:
*   [x] Custom clickable language switcher dropdown integrated in the primary header.
*   [x] Deep high-contrast dark UI palette matching ink-navy, muted-slate, and warm-turmeric.
*   [x] Full Sinhala and Tamil native script fallback for local accessibility.
*   [x] Fully responsive bento grid structure optimized for desktop-first and mobile touch interfaces.
