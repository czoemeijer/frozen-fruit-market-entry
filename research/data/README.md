# Research Data — Raw Datasets

This directory contains all raw data used in the thesis charts and analysis.
Every data point is stored here for reproducibility and academic transparency.

## Files

| File | Description | Source | Status |
|---|---|---|---|
| `czso_food_consumption.csv` | Czech food consumption per capita (2018–2023) | ČSÚ – Spotřeba potravin | ✅ Verified |
| `ee_frozen_market.csv` | Eastern Europe frozen F&V market size | FrozenFoodEurope.com (2025) | ✅ Verified (2023–2025), estimated (2020–2022) |
| `pricing_comparison.csv` | Product pricing: Franui vs Berrie | Rohlík.cz / proposed | ✅ Franui verified, Berrie proposed |
| `percapita_spending.csv` | Per capita frozen F&V spending (EE vs WE) | FrozenFoodEurope.com (2025) | ✅ Verified |

## Data Provenance

### ČSÚ (Czech Statistical Office)
- **Website:** https://czso.cz
- **Publication:** Spotřeba potravin – 2023
- **Method:** Balance method (bilanční metoda) — food available for direct consumption per capita per year
- **Notes:**
  - Fruit consumption is reported as "fresh equivalent" (v hodnotě čerstvého)
  - ČSÚ does NOT publish "frozen fruit" as a separate category
  - Chocolate = "čokoláda a čokoládové cukrovinky"
  - Ice cream: ČSÚ does not track as a standalone item; values estimated from Eurostat production data and media reports (~4–5 liters/person/year)

### FrozenFoodEurope.com
- **Report:** Eastern Europe Frozen Processed Fruits & Vegetables Market
- **Verified data points:** 2023 (USD 2.36 bn), 2024 (USD 2.53 bn), 2025 forecast (USD 2.64 bn)
- **Per capita:** EE = USD 8.10, WE = USD 24.00 (2024)

### Rohlík.cz
- **Product:** Franuí – Mražené maliny v čokoládě 150g
- **Price:** 159.99 Kč (verified April 19, 2026)

## How to Update Data
1. Visit the relevant source website
2. Update the CSV file with new values
3. Add `source_status` = `verified` and note the date
4. Re-run `python3 generate_charts.py` from the `research/` directory
