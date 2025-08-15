
import React from "react";
import { Moon, Sun } from "lucide-react";
import clsx from "clsx";

const PERIODS = ["1mo","3mo","6mo","1y","2y"];

export function Header({ dark, setDark, period, setPeriod }) {
  return (
    <header className="col-span-12 flex items-center justify-between">
      <h1 className="text-2xl md:text-3xl font-bold">
        <span className="text-accent">JarNox</span> Stock Dashboard
      </h1>
      <div className="flex items-center gap-2">
        <div className="hidden md:flex bg-white/70 dark:bg-slate-800 p-1 rounded-xl">
          {PERIODS.map(p => (
            <button
              key={p}
              onClick={()=>setPeriod(p)}
              className={clsx("px-3 py-1 rounded-lg text-sm",
                p===period ? "bg-accent text-white" : "hover:bg-slate-200 dark:hover:bg-slate-700"
              )}
            >
              {p}
            </button>
          ))}
        </div>
        <button
          className="card !p-2"
          onClick={()=>setDark(!dark)}
          title="Toggle theme"
        >
          {dark ? <Sun size={18}/> : <Moon size={18}/>}
        </button>
      </div>
    </header>
  )
}
