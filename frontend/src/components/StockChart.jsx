
import React, { useMemo } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Tooltip, Legend, Filler
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler);

export function StockChart({ series, stats, pred }) {
  const labels = series.candles.map(c => c.date);
  const closes = series.candles.map(c => c.close);
  const volumes = series.candles.map(c => c.volume);

  const sma = (arr, n) => arr.map((_, i) => {
    if (i < n-1) return null;
    const slice = arr.slice(i-n+1, i+1);
    return slice.reduce((a,b)=>a+b,0)/n;
  });

  const sma20 = sma(closes, 20);
  const sma50 = sma(closes, 50);

  const data = {
    labels,
    datasets: [
      {
        label: "Close",
        data: closes,
        borderWidth: 2,
        fill: true,
        tension: 0.2
      },
      {
        label: "SMA 20",
        data: sma20,
        borderWidth: 1.5,
        borderDash: [6,6],
        pointRadius: 0
      },
      {
        label: "SMA 50",
        data: sma50,
        borderWidth: 1.5,
        borderDash: [2,4],
        pointRadius: 0
      },
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    interaction: { mode: "index", intersect: false },
    scales: {
      y: { beginAtZero: false },
    }
  };

  const volData = {
    labels,
    datasets: [
      {
        label: "Volume",
        data: volumes,
        borderWidth: 0,
      }
    ]
  }

  const volOptions = {
    scales: {
      y: { beginAtZero: true, display: true },
      x: { display: false }
    },
    plugins: { legend: { display: false } },
    maintainAspectRatio: false,
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      <div className="h-[360px]">
        <Line data={data} options={options} />
      </div>
      <div className="h-[120px]">
        <Bar data={volData} options={volOptions} />
      </div>
    </div>
  )
}
