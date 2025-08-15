
import React from "react";

function Stat({ label, value, sub }) {
  return (
    <div className="card">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="text-xl font-semibold">{value}</div>
      {sub && <div className="badge mt-2">{sub}</div>}
    </div>
  );
}

export function StatsCards({ stats, pred }) {
  const sign = stats.change_pct >= 0 ? "+" : "";
  const cp = stats.current_price?.toFixed(2);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Stat label="Current Price" value={`₹ ${cp}`} sub={`${sign}${stats.change_pct.toFixed(2)}% today`} />
      <Stat label="52W High" value={`₹ ${stats.high_52w.toFixed(2)}`} />
      <Stat label="52W Low" value={`₹ ${stats.low_52w.toFixed(2)}`} />
      <Stat label="Avg Volume (90d)" value={stats.avg_volume.toLocaleString()} />
    </div>
  );
}
