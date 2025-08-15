
import React, { useMemo, useState } from "react";
import { Search } from "lucide-react";
import clsx from "clsx";

function initials(name) {
  return name.split(" ").slice(0,2).map(p=>p[0]).join("").toUpperCase();
}

export function Sidebar({ companies, selected, onSelect }) {
  const [q, setQ] = useState("");
  const filtered = useMemo(() => {
    return companies.filter(c => c.name.toLowerCase().includes(q.toLowerCase()) || c.ticker.toLowerCase().includes(q.toLowerCase()))
  }, [companies, q]);

  return (
    <div className="card h-full">
      <div className="relative mb-3">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
        <input
          className="w-full rounded-xl pl-8 pr-3 py-2 bg-white/60 dark:bg-slate-800 outline-none"
          placeholder="Search companies..."
          value={q}
          onChange={e=>setQ(e.target.value)}
        />
      </div>
      <div className="space-y-2 max-h-[70vh] overflow-auto pr-1">
        {filtered.map(c => (
          <button
            key={c.ticker}
            onClick={()=>onSelect(c)}
            className={clsx(
              "w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition",
              selected?.ticker === c.ticker && "ring-2 ring-accent bg-slate-100 dark:bg-slate-800"
            )}
          >
            <div className="h-8 w-8 rounded-xl bg-accent/20 grid place-items-center text-accent font-semibold">
              {initials(c.name)}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{c.name}</div>
              <div className="text-[11px] text-slate-500">{c.ticker}</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
