
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Literal
import pandas as pd
import numpy as np
import os
from datetime import datetime, timedelta
import sqlite3

DB_PATH = os.path.join(os.path.dirname(__file__), "data", "app.db")

app = FastAPI(title="Stock Dashboard API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COMPANIES = [
    {"name": "Reliance Industries", "ticker": "RELIANCE.NS"},
    {"name": "Tata Consultancy Services", "ticker": "TCS.NS"},
    {"name": "HDFC Bank", "ticker": "HDFCBANK.NS"},
    {"name": "Infosys", "ticker": "INFY.NS"},
    {"name": "ICICI Bank", "ticker": "ICICIBANK.NS"},
    {"name": "Bharti Airtel", "ticker": "BHARTIARTL.NS"},
    {"name": "Hindustan Unilever", "ticker": "HINDUNILVR.NS"},
    {"name": "ITC", "ticker": "ITC.NS"},
    {"name": "State Bank of India", "ticker": "SBIN.NS"},
    {"name": "Larsen & Toubro", "ticker": "LT.NS"},
    {"name": "Adani Enterprises", "ticker": "ADANIENT.NS"},
]

class Candle(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int

class StockResponse(BaseModel):
    ticker: str
    candles: List[Candle]

class StatsResponse(BaseModel):
    ticker: str
    current_price: float
    change_pct: float
    high_52w: float
    low_52w: float
    avg_volume: int
    sma20: Optional[float]
    sma50: Optional[float]

class PredictionResponse(BaseModel):
    ticker: str
    next_day_close: float

def _conn():
    return sqlite3.connect(DB_PATH)

def _read_df(ticker: str) -> pd.DataFrame:
    with _conn() as con:
        return pd.read_sql_query(
            "SELECT * FROM prices WHERE ticker=? ORDER BY date ASC", con, params=(ticker,),
            parse_dates=["date"]
        )

def _period_filter(df: pd.DataFrame, period: str) -> pd.DataFrame:
    if df.empty:
        return df
    end = df["date"].max()
    mapping = {
        "1d": 1, "5d": 5, "1mo": 30, "3mo": 90,
        "6mo": 180, "1y": 365, "2y": 730, "5y": 1825
    }
    if period in mapping:
        start = end - pd.Timedelta(days=mapping[period])
        df = df[df["date"] >= start]
    return df

@app.get("/companies")
def companies():
    return COMPANIES

@app.get("/stocks/{ticker}", response_model=StockResponse)
def stocks(
    ticker: str,
    period: Literal["1d","5d","1mo","3mo","6mo","1y","2y","5y"]="6mo",
):
    df = _read_df(ticker)
    if df.empty:
        raise HTTPException(404, "No data for ticker")
    df = _period_filter(df, period)
    out = [
        {
            "date": d.strftime("%Y-%m-%d"),
            "open": float(o),
            "high": float(h),
            "low": float(l),
            "close": float(c),
            "volume": int(v),
        }
        for d,o,h,l,c,v in zip(df["date"], df["open"], df["high"], df["low"], df["close"], df["volume"])
    ]
    return {"ticker": ticker, "candles": out}

@app.get("/stats/{ticker}", response_model=StatsResponse)
def stats(ticker: str):
    df = _read_df(ticker)
    if df.empty:
        raise HTTPException(404, "No data for ticker")
    last = df.iloc[-1]
    current = last["close"]
    prev = df.iloc[-2]["close"] if len(df) > 1 else current
    change_pct = ((current - prev) / prev) * 100 if prev else 0.0
    high_52w = float(df.tail(252)["high"].max())
    low_52w = float(df.tail(252)["low"].min())
    avg_volume = int(df.tail(90)["volume"].mean())
    sma20 = float(df["close"].rolling(20).mean().iloc[-1])
    sma50 = float(df["close"].rolling(50).mean().iloc[-1])
    return {
        "ticker": ticker,
        "current_price": float(current),
        "change_pct": float(change_pct),
        "high_52w": high_52w,
        "low_52w": low_52w,
        "avg_volume": avg_volume,
        "sma20": sma20,
        "sma50": sma50,
    }

@app.get("/predict/{ticker}", response_model=PredictionResponse)
def predict(ticker: str):
    # Simple baseline prediction: next close = last close + (last close - previous close)*0.3
    df = _read_df(ticker)
    if df.empty or len(df) < 2:
        raise HTTPException(404, "Insufficient data for prediction")
    last = df["close"].iloc[-1]
    prev = df["close"].iloc[-2]
    drift = (last - prev) * 0.3
    pred = last + drift
    return {"ticker": ticker, "next_day_close": float(pred)}
