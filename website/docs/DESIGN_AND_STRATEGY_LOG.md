# Krunchies Official Website & Market Entry Strategy Log
**Project**: Krunchies Market Entry & Official Web Platform  
**Domain**: `krunchies.eu.org`  
**Date**: August 2026  
**Document Status**: Official Architecture & Design Specification (Local Log / 本地记录与设计留痕)

---

## 1. Brand Evolution & Positioning Strategy (品牌重塑与定位)

### 1.1 Brand Naming: From "Berrie" to "Krunchies"
- **Legacy Name**: *Berrie*  
  - *Analysis*: While clean, "Berrie" limited the brand perception strictly to berry fruits (strawberries, blueberries) and lacked high-energy snack appeal. It sounded like a standard frozen fruit label rather than a disruptive, craveable premium treat.
- **New Brand Identity**: **Krunchies**  
  - *Analysis*: "Krunchies" communicates texture immediately—the satisfying "crunch" of freeze-dried organic fruit enveloped in smooth Belgian dark chocolate. It appeals to modern snacks enthusiasts, Gen Z & Millennials, health-conscious impulse buyers, and specialty food shoppers.
  - *Slogan / Taglines*: 
    - *"KRUNCHY OUTSIDE, YUMMY INSIDE!"*
    - *"Real Fruit. Rich Chocolate. Totally Krunchy."*
    - *"Snack Happy. Feel Good."*

### 1.2 Target Audience & Market Entry Focus
1. **Urban Health-Conscious Foodies (25–40)**: Seeking guilt-free indulgence made with high quality, natural ingredients.
2. **Impulse Snackers & University Students (18–25)**: Attracted to bold visual aesthetics, social-media-friendly packaging, and instant gratification.
3. **Parents seeking better options for kids**: Real fruit base with minimal artificial additives.

---

## 2. Visual Identity & Design System (2D Pop-Art Comic Aesthetic)

### 2.1 Visual Philosophy
The packaging artwork (`krunchies-banana-bites.png`) introduces a unique 2D Pop-Art comic book illusion style. The website design directly mirrors this packaging aesthetic to create strong visual consistency across digital and physical touchpoints.

### 2.2 Core Design Tokens
- **Color Palette**:
  - `Primary Yellow`: `#FFDE59` / `#FCD34D` (High-energy comic background yellow)
  - `Rich Chocolate`: `#3E2723` / `#2C1A1D` (Deep cocoa dark chocolate brown)
  - `Pop Coral / Pink`: `#FF5757` / `#FF4081` (Burst badges, accent highlights)
  - `Mint Turquoise`: `#00E5FF` / `#10B981` (Nutrition & freshness badges)
  - `Pure White`: `#FFFFFF` (Comic text fills, contrast panels)
  - `Outline Black`: `#000000` (Thick 3px-4px comic line work)
- **Typography**:
  - `Display / Headings`: `'Bangers'`, `'Fugaz One'`, or comic pop display fonts (Google Fonts)
  - `Body / UI`: `'Outfit'`, `'Inter'`, sans-serif with bold weight hierarchy
- **Borders & Shadows**:
  - Neo-brutalist pop shadows: `box-shadow: 5px 5px 0px #000000;`
  - Comic borders: `border: 3px solid #000000; border-radius: 12px;`
  - Halftone dot overlay patterns for retro comic print effect.

---

## 3. Web Architecture & Module Blueprint (网站架构与模块图纸)

```
[ Root: /website ]  (Deploying to Cloudflare Workers -> krunchies.eu.org)
│
├── index.html                     --> Krunchies Official Brand Landing Page
├── css/style.css                  --> Global Pop-Art Design Tokens & Styles
├── js/main.js                     --> Interactive UI, Flavor Switcher, Cart Teaser
├── images/                        --> Product High-Res Assets & Mockups
│   └── krunchies-banana-bites.png
│
├── survey/                        --> Internal Consumer Market Research Module (CAWI)
│   ├── index.html                 --> Multi-step CAWI Survey UI (20+ Languages)
│   ├── style.css                  --> Survey Pop-Art Re-theme
│   ├── script.js                  --> i18n & API Client Logic
│   ├── dashboard.html             --> Admin Analytics Dashboard
│   └── dashboard.js & css
│
├── docs/                          --> Architecture, Thesis & Design Logs (Local Traceability)
│   └── DESIGN_AND_STRATEGY_LOG.md
│
├── worker.js                      --> Cloudflare Worker Router & D1 API handler (/api/submit)
└── wrangler.toml                  --> Cloudflare Worker Deployment Configuration
```

---

## 4. Academic Thesis Integration & Data Logging (论文对接与数据留痕)

The survey module `/website/survey` serves as the primary data collection tool (CAWI methodology) for market entry research.

- **Key Research Variables Collected**:
  1. Demographics & Purchase Frequency (`age`, `children`, `purchase_frequency`)
  2. Product Concept Evaluation & Purchase Intent (`intent`, `preference`)
  3. Price Sensitivity Meter (Van Westendorp PSM: `psm_too_cheap`, `psm_cheap`, `psm_expensive`, `psm_too_expensive`)
  4. Brand Image Perceptions (`berrie_visual` -> `krunchies_visual`, `quality`, `health` ratings vs. competitors like Franuí)
  5. Distribution & Main Barrier Insights (`main_barrier`, `local_importance`, `premium_wtp`)

- **Data Persistence**:
  - Cloudflare D1 SQL table (`survey_responses`).
  - Local SQLite backup support (`survey_data.db`) via export script (`export_data.py`).

---

## 5. Deployment Guide (Cloudflare Workers)

1. **Root Directory**: `website/`
2. **Commands**:
   ```bash
   cd website
   npx wrangler d1 create krunchies_survey_db
   npx wrangler d1 execute krunchies_survey_db --file=survey/deploy/cloudflare/schema.sql
   npx wrangler deploy
   ```
3. **Custom Domain**: Point `krunchies.eu.org` to the deployed Cloudflare Worker route.
