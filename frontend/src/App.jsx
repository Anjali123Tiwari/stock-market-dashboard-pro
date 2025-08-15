
import React, { useEffect, useMemo, useState } from "react";
import { Sidebar } from "./components/Sidebar.jsx";
import { Header } from "./components/Header.jsx";
import { StatsCards } from "./components/StatsCards.jsx";
import { StockChart } from "./components/StockChart.jsx";
import { Loader } from "./components/Loader.jsx";
import * as api from "./services/api.js";

export default function App() {
  const [companies, setCompanies] = useState([]);
  const [selected, setSelected] = useState(null);
  const [period, setPeriod] = useState("6mo");
  const [series, setSeries] = useState(null);
  const [stats, setStats] = useState(null);
  const [pred, setPred] = useState(null);
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    (async () => {
      const list = await api.getCompanies();
      setCompanies(list);
      setSelected(list[0]);
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoading(true);
    Promise.all([
      api.getStock(selected.ticker, period),
      api.getStats(selected.ticker),
      api.getPrediction(selected.ticker),
    ])
      .then(([s, st, pr]) => {
        setSeries(s);
        setStats(st);
        setPred(pr);
      })
      .finally(() => setLoading(false));
  }, [selected, period]);

  return (
    <div className="min-h-screen grid grid-cols-12 gap-4 p-4 md:p-6">
      <Header dark={dark} setDark={setDark} period={period} setPeriod={setPeriod} />
      <aside className="col-span-12 md:col-span-3 lg:col-span-2">
        <Sidebar
          companies={companies}
          selected={selected}
          onSelect={setSelected}
        />
      </aside>

      <main className="col-span-12 md:col-span-9 lg:col-span-10 flex flex-col gap-4">
        {loading && <Loader />}
        {!loading && stats && (
          <StatsCards stats={stats} pred={pred} />
        )}
        <div className="card">
          {series ? (
            <StockChart series={series} stats={stats} pred={pred} />
          ) : (
            <div className="text-sm text-slate-400">No data</div>
          )}
        </div>
        <footer className="text-xs text-slate-500 mt-2">
          Built for JarNox — Demo with sample data. Switch to live easily on the backend.
        </footer>
      </main>
    </div>
  );
}
