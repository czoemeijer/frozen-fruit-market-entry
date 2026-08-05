# Web Survey Module (Krunchies Market Entry)

This module contains the multilingual CAWI survey frontend integrated into the **Krunchies** official platform (`krunchies.eu.org`), along with backend endpoints and Cloudflare Workers database connectors.

## Directory Structure

```text
website/survey/
├── index.html                       # Multi-step CAWI survey UI (Pop-Art theme)
├── style.css                        # Survey styling stylesheet
├── script.js                        # Survey logic, i18n dictionaries (20+ languages)
├── dashboard.html                   # Admin analytics & response dashboard
├── backend.py                       # Local standalone Python survey server
├── export_data.py                   # Data export utility (SQLite -> CSV)
└── deploy/                          # Systemd, launchd, Cloudflare & Vercel deployment templates
```

---

## 1) Local Run

```bash
cd website/survey
python3 backend.py
```

Open:
- http://localhost:8000/

Data is stored in:
- `website/survey/survey_data.db`

Export CSV for analysis:
```bash
python3 export_data.py
```

---

## 2) Cloudflare Workers Integration
The parent worker (`website/worker.js`) handles `/api/submit` requests and persists data into Cloudflare D1 database (`SURVEY_DB`).
