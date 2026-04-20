# Diplomová práce – Marketingový výzkum a vstup značky Berrie na trh

Tento repozitář obsahuje kompletní podklady pro diplomovou práci:

- text práce v LaTeXu,
- analytický modul pro data a grafy,
- webový CAWI dotazník s backendem,
- podpůrné deploy šablony (persistent run + serverless).

**Téma:** vstup nové značky mraženého ovoce v čokoládě na český trh  
**Značka:** Berrie

---

## Struktura

- `thesis/` — LaTeX zdroj práce (viz [thesis/README.md](thesis/README.md))
- `research/` — datové skripty a grafy (viz [research/README.md](research/README.md))
- `web-survey/` — vícejazyčný dotazník + backend + deploy šablony (viz [web-survey/README.md](web-survey/README.md))
- `private/` — citlivé interní podklady (necommitovat)

---

## Rychlý start

### 1) Kompilace diplomky

```bash
cd thesis
make pdf
```

Výstup: `dst/Meijer_Catherine_Diplomova_Prace.pdf`

### 2) Výzkumné grafy

```bash
cd research
pip install -r requirements.txt
python3 generate_charts.py
```

### 3) Webový dotazník

```bash
cd web-survey
python3 backend.py
```

Frontend poběží na `http://localhost:8000/`.

---

## Nasazení dotazníku

Podporované varianty jsou zdokumentované v [web-survey/README.md](web-survey/README.md):

- Linux persistent run: `systemd`
- macOS persistent run: `launchd`
- Serverless: Cloudflare Workers + D1
- Serverless: Vercel Functions + Vercel Postgres

Globální technická analýza projektu: [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md)

---

## Poznámky k datům

- Lokální sběr dat v `web-survey` používá SQLite (`survey_data.db`).
- Export do CSV: `python3 web-survey/export_data.py`
- Pro serverless prostředí je doporučená managed DB (D1 / Postgres), nikoliv SQLite soubor.