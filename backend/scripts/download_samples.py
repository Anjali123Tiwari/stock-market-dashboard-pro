import yfinance as yf
import os

# Ensure data folder exists
os.makedirs("../data", exist_ok=True)

# List of tickers for sample dataset
tickers = ["RELIANCE.NS", "TCS.NS", "HDFCBANK.NS"]

for t in tickers:
    print(f"Downloading {t}...")
    df = yf.download(t, period="1y", interval="1d", progress=False)
    filename = f"{t.replace('.', '_')}_1y.csv"
    df.to_csv(os.path.join("../data", filename))
    print(f"Saved {filename}")

print("✅ All sample datasets downloaded successfully!")
