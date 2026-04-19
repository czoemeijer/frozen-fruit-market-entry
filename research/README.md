# Research Module

This directory contains all research tools, raw data, and generated outputs for the thesis.

## Structure

```
research/
├── README.md              ← You are here
├── requirements.txt       ← Python dependencies
├── generate_charts.py     ← Main chart generation script (audited)
├── data/                  ← Raw datasets (CSV) with README
│   ├── README.md          ← Data provenance documentation
│   ├── czso_food_consumption.csv
│   ├── ee_frozen_market.csv
│   ├── pricing_comparison.csv
│   └── percapita_spending.csv
└── output/                ← Generated charts (PDF + PNG)
    ├── market_size_eastern_europe.pdf/.png
    ├── fruit_consumption_cz.pdf/.png
    ├── chocolate_consumption_cz.pdf/.png
    ├── ice_cream_consumption_cz.pdf/.png
    ├── price_comparison.pdf/.png
    ├── psm_analysis.pdf/.png
    ├── segmentation_radar.pdf/.png
    ├── percapita_spending.pdf/.png
    ├── marketing_mix_4p.pdf/.png
    └── psm_results.json
```

## Usage

```bash
# Install dependencies
pip install -r requirements.txt

# Generate all charts (reads from data/, writes to output/ and thesis/images/)
python3 generate_charts.py
```

## Data Integrity Rules
- Every data point must be categorized as **VERIFIED**, **DERIVED**, or **SUBJECTIVE**
- All VERIFIED data must have a named source and access date
- CSV files in `data/` are the single source of truth — the chart script reads from them
- Charts must display the data source in annotations or captions
