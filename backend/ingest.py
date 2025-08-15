
"""
Generates sample OHLCV data if not present and loads it into SQLite.
"""
from datetime import datetime, timedelta
import random, csv, os
from pathlib import Path
from database import init_db, load_csvs, SAMPLE

COMPANY_TICKERS = [
    "RELIANCE.NS","TCS.NS","HDFCBANK.NS","INFY.NS","ICICIBANK.NS",
    "BHARTIARTL.NS","HINDUNILVR.NS","ITC.NS","SBIN.NS","LT.NS","ADANIENT.NS"
]

def ensure_sample_csvs():
    SAMPLE.mkdir(parents=True, exist_ok=True)
    end = datetime.today().date()
    start = end - timedelta(days=365*2)  # ~2 years
    for t in COMPANY_TICKERS:
        path = SAMPLE / f"{t}.csv"
        if path.exists():
            continue
        with open(path, "w", newline="") as f:
            writer = csv.writer(f)
            writer.writerow(["date","open","high","low","close","volume"])
            price = random.uniform(200, 3000)
            d = start
            while d <= end:
                if d.weekday() >= 5:  # skip weekends
                    d += timedelta(days=1)
                    continue
                change = random.uniform(-0.02, 0.02)  # +/- 2%
                open_p = price
                close_p = price * (1 + change)
                high_p = max(open_p, close_p) * (1 + random.uniform(0.0, 0.01))
                low_p = min(open_p, close_p) * (1 - random.uniform(0.0, 0.01))
                volume = int(random.uniform(1e6, 8e6))
                writer.writerow([d.isoformat(), f"{open_p:.2f}", f"{high_p:.2f}", f"{low_p:.2f}", f"{close_p:.2f}", volume])
                price = close_p
                d += timedelta(days=1)

if __name__ == "__main__":
    ensure_sample_csvs()
    init_db()
    load_csvs()
    print("Sample data loaded to SQLite (data/app.db).")
