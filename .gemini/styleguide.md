# Frozen Fruit Market Entry — Project Conventions

## Repository Structure
- `thesis/` — LaTeX source files (main.tex, chapters/, images/, literature.bib)
- `research/` — Python scripts, raw data, and generated outputs
- `research/data/` — Raw CSV datasets with data provenance README
- `research/output/` — Generated charts (PDF + PNG)
- `dst/` — Final compiled PDF output

## Build System
- **Compiler:** LuaLaTeX via MacTeX (`mactex-no-gui`)
- **Build command:** `cd thesis && make pdf`
- **Output:** `dst/Meijer_Catherine_Diplomova_Prace.pdf`
- **Clean:** `cd thesis && make clean`

## Data Integrity Rules
1. Every data point in `generate_charts.py` MUST be categorized as:
   - **VERIFIED** — Confirmed from a named public source with date
   - **DERIVED** — Calculated from verified anchor points (transparently labeled)
   - **SUBJECTIVE** — Author's expert assessment (clearly labeled in charts)
2. All raw data MUST be stored as CSV in `research/data/` — the chart script reads from there
3. Each CSV file must have clear column headers and the `data/README.md` must document its source
4. Charts must display the data source in annotations or figure captions
5. Never invent data. If data cannot be verified, label it as ESTIMATE with source context

## Citation Rules
- Use `\parencite{key}` for parenthetical citations: "... rostoucí trend [1]."
- Use `\textcite{key}` for narrative citations: "Kotler [1] definuje..."
- NEVER use informal `(Author, Year)` format — always use biblatex commands
- Bibliography style: `numeric` (ISO 690), `sorting=none` (order of first appearance)
- All .bib entries must have complete fields (author, title, year, publisher/url)

## Chart Generation
- Script: `research/generate_charts.py`
- Run: `cd research && python3 generate_charts.py`
- Charts are saved to both `research/output/` and `thesis/images/`
- Format: PDF (for LaTeX) + PNG (for preview)
- Use ASCII-safe text in matplotlib annotations to avoid font glyph warnings

## Documentation Rules
- Every directory with non-trivial content MUST have a `README.md`
- README should explain: purpose, file listing, data sources, usage instructions
- `research/data/README.md` must document data provenance for every CSV file

## Academic Standards
- Language: Czech (with English abstract)
- Citation format: ISO 690 numeric
- University: Panevropská univerzita
- Thesis type: Diplomová práce (Master's thesis)
- Author: Bc. Catherine Zoë Meijer

## Workflow for Adding New Data
1. Search for and verify data from public sources (ČSÚ, Eurostat, USDA FAS, etc.)
2. Save raw data as CSV in `research/data/`
3. Update `research/data/README.md` with source documentation
4. Add chart function to `generate_charts.py` with source comments
5. Add section to appropriate thesis chapter with `\parencite{}` citation
6. Add .bib entry to `thesis/literature.bib`
7. Run `python3 generate_charts.py` then `make pdf`
8. Commit with descriptive message explaining data source
