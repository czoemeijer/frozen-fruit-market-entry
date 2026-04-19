import sqlite3
import csv
import os

DB_PATH = "survey_data.db"
CSV_OUT = "research/data/real_survey_responses.csv"

def export_to_csv():
    if not os.path.exists(DB_PATH):
        print(f"Error: Databáze {DB_PATH} nebyla nalezena.")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Get all rows
    cursor.execute("SELECT * FROM survey_responses")
    rows = cursor.fetchall()
    
    if not rows:
        print("Databáze je zatím prázdná (žádné odpovědi).")
        conn.close()
        return

    # Get column names
    col_names = [description[0] for description in cursor.description]
    
    # Ensure output directory exists
    os.makedirs(os.path.dirname(CSV_OUT), exist_ok=True)

    with open(CSV_OUT, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow(col_names)
        writer.writerows(rows)
        
    print(f"Úspěch! Byla exportována data ({len(rows)} odpovědí) do souboru: {CSV_OUT}")
    
    conn.close()

if __name__ == '__main__':
    export_to_csv()
