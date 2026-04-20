# Web Survey Module (Berrie Market Entry)

This module contains the multilingual CAWI survey frontend and a lightweight Python backend for collecting responses.

## Directory

```text
web-survey/
├── index.html
├── style.css
├── script.js
├── backend.py
├── export_data.py
├── survey_data.db                    # created at runtime
├── scripts/
│   ├── start_backend.sh
│   └── install_systemd_service.sh
└── deploy/
    ├── systemd/
    │   └── berrie-survey.service
    ├── launchd/
    │   └── com.berrie.survey.plist
    ├── cloudflare/
    │   ├── worker.js
    │   ├── schema.sql
    │   └── wrangler.toml.example
    └── vercel/
        ├── api/submit.js
        ├── package.json
        └── vercel.json
```

---

## 1) Local run (recommended for thesis data collection)

```bash
cd web-survey
python3 backend.py
```

Open:

- http://localhost:8000/

Data is stored in:

- `web-survey/survey_data.db`

Export CSV for analysis:

```bash
cd web-survey
python3 export_data.py
```

---

## 2) Persistent process run

### Linux (`systemd`)

1. Make scripts executable:

```bash
cd web-survey
chmod +x scripts/start_backend.sh scripts/install_systemd_service.sh
```

2. Install service:

```bash
./scripts/install_systemd_service.sh
```

3. Useful commands:

```bash
sudo systemctl restart berrie-survey.service
sudo systemctl status berrie-survey.service
sudo journalctl -u berrie-survey.service -f
```

### macOS (`launchd`)

1. Copy and edit the template:

- `deploy/launchd/com.berrie.survey.plist`
- Replace `/ABSOLUTE/PATH/TO/web-survey` with your real path.

2. Load service:

```bash
launchctl load ~/Library/LaunchAgents/com.berrie.survey.plist
launchctl start com.berrie.survey
```

3. Unload service:

```bash
launchctl unload ~/Library/LaunchAgents/com.berrie.survey.plist
```

---

## 3) Serverless deployment options

> Note: serverless does **not** persist SQLite reliably. Use managed DB.

### A. Cloudflare Workers + D1 (recommended serverless path)

Files:

- `deploy/cloudflare/worker.js`
- `deploy/cloudflare/schema.sql`
- `deploy/cloudflare/wrangler.toml.example`

Steps:

```bash
cd web-survey/deploy/cloudflare
npm create cloudflare@latest
# copy worker.js and wrangler.toml.example -> wrangler.toml
wrangler d1 create berrie-survey-db
wrangler d1 execute berrie-survey-db --file=./schema.sql
wrangler deploy
```

Then point the frontend submit URL to Worker endpoint `/submit`.

### B. Vercel Functions + Vercel Postgres

Files:

- `deploy/vercel/api/submit.js`
- `deploy/vercel/package.json`
- `deploy/vercel/vercel.json`

Steps:

```bash
cd web-survey/deploy/vercel
npm install
vercel
```

In Vercel dashboard, add Postgres integration and ensure `@vercel/postgres` is available.

---

## 4) i18n and questionnaire completeness

Current behavior in `script.js`:

- Language detection from browser + saved preference (`localStorage`)
- Full fallback chain: selected language -> English -> Czech -> key
- Missing keys auto-filled from English at runtime to keep all language packs complete

Questionnaire enhancements for thesis topic (market entry):

- purchase frequency (behavioral segmentation)
- preferred channel (distribution strategy)
- main purchase barrier (adoption obstacle)
- PSM logical order validation before submit

---

## 5) Data model (current)

Main fields persisted:

- Demographics: `age`, `children`, `purchase_frequency`
- Product comparison: Franui/Berrie 3× perception scores + `intent`
- Pricing: 4x PSM prices
- Local preference and premium willingness
- Channel preference + main barrier
- `language`, `ip_address`, timestamp

---

## 6) Production notes

- Put backend behind reverse proxy (`nginx`/`caddy`) with TLS.
- Restrict CORS for production domain.
- Rotate and back up `survey_data.db` regularly.
- Consider replacing SQLite with managed Postgres for concurrent writes.
