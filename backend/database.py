
import os, sqlite3, csv
from pathlib import Path

BASE = Path(__file__).resolve().parent
DB = BASE / "data" / "app.db"
SAMPLE = BASE / "sample_data"

def init_db():
    DB.parent.mkdir(parents=True, exist_ok=True)
    con = sqlite3.connect(DB)
    cur = con.cursor()
    cur.execute("""
        CREATE TABLE IF NOT EXISTS prices(
            ticker TEXT,
            date TEXT,
            open REAL,
            high REAL,
            low REAL,
            close REAL,
            volume INTEGER,
            PRIMARY KEY (ticker, date)
        )
    """)
    con.commit()
    con.close()

def load_csvs():
    con = sqlite3.connect(DB)
    cur = con.cursor()
    files = list(SAMPLE.glob("*.csv"))
    for f in files:
        ticker = f.stem
        with open(f, newline="") as fh:
            reader = csv.DictReader(fh)
            rows = [
                (ticker, r["date"], float(r["open"]), float(r["high"]), float(r["low"]), float(r["close"]), int(float(r["volume"])))
                for r in reader
            ]
        cur.executemany("INSERT OR REPLACE INTO prices VALUES (?,?,?,?,?,?,?)", rows)
    con.commit()
    con.close()

if __name__ == "__main__":
    init_db()
    load_csvs()
    print("DB initialized and sample data ingested.")
