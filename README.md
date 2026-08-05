# Diplomová práce & Krunchies Official Web Platform

Tento repozitář obsahuje kompletní podklady pro diplomovou práci a oficiální webovou platformu značky **Krunchies** (`krunchies.eu.org`):

- **Oficiální webové stránky & výzkumný dotazník**: `website/` (Pop-Art komiksový styl, Cloudflare Workers deployment)
- **Text práce v LaTeXu**: `thesis/`
- **Analytický modul pro data a grafy**: `research/`
- **Dokumentace a návrhové záznamy (Local Traceability Logs)**: `website/docs/`

**Téma:** Vstup nové značky mraženého a lyofilizovaného ovoce v čokoládě na evropský trh  
**Značka:** Krunchies (dříve Berrie)  
**Doména:** `krunchies.eu.org`

---

## 📁 Struktura Repozitáře

- `website/` — **Oficiální web Krunchies + Integrovaný výzkumný dotazník (CAWI)**
  - `index.html` — Oficiální prezentace značky v 2D Pop-Art comic stylu.
  - `css/style.css` — Pop-Art design systém (Bangers, Outfit, neobrutalistické stíny, bold borders).
  - `images/` — Produktová fotodokumentace a obalový design (`krunchies-banana-bites.png`).
  - `survey/` — Vícejazyčný CAWI výzkumný dotazník pro sběr dat (20+ jazyků).
  - `docs/` — Lokální záznamy návrhu, značky a strategických rozhodnutí (`DESIGN_AND_STRATEGY_LOG.md`).
  - `worker.js` & `wrangler.toml` — Konfigurace Cloudflare Worker / Pages deploymentu.
- `thesis/` — LaTeX zdroj diplomové práce (viz [thesis/README.md](thesis/README.md)).
- `research/` — Datové skripty a analytické grafy (viz [research/README.md](research/README.md)).
- `private/` — Citlivé interní podklady (necommitovat).

---

## ⚡ Rychlý Start

### 1) Lokální Zobrazení Webu
Otevřete `website/index.html` v prohlížeči nebo použijte lokální statický server:
```bash
cd website
python3 -m http.server 8000
```
Web poběží na `http://localhost:8000/` a dotazník na `http://localhost:8000/survey/`.

### 2) Nasazení na Cloudflare Workers (`krunchies.eu.org`)
```bash
cd website
npx wrangler deploy
```

---

## 📝 Lokální Záznamy & Logování (Local Traceability)
Všechny konceptuální myšlenky, designové volby, cenové matice a změny v branding z logických důvodů udržujeme lokálně zaznamenané v:
👉 [website/docs/DESIGN_AND_STRATEGY_LOG.md](website/docs/DESIGN_AND_STRATEGY_LOG.md)
## Copyright & Licensing

This is a public repository for viewing and personal, non-commercial evaluation. The original Krunchies brand, packaging concepts, product visuals, copy, website design, research materials, and code are **not** released under an open-source license. Please see [`LICENSE.md`](LICENSE.md).

Any permitted quotation or reference must credit **Original work by Catherine Zoë Meijer / Krunchies**. Commercial use, reuse in products or client work, redistribution, derivative work, and AI-training use require prior written permission and a separate paid license.

> Note: a public GitHub repository can still be viewed or forked through GitHub’s platform. The license controls reuse and commercial exploitation; it cannot technically prevent a platform user from making a fork.
