import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { ROADMAP } from '../data/plan';

export default function RoadmapView({ state, toggleRoadmapTask }) {
  const [open, setOpen] = useState('y1');

  return (
    <div className="fade-up">
      <div className="mb-6">
        <p className="font-mono text-xs text-[var(--slate)] uppercase tracking-widest">Google · Microsoft · Apple</p>
        <h1 className="font-display text-3xl font-semibold">4-year roadmap</h1>
      </div>

      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-[var(--line)] md:left-[19px]" />
        <ol className="flex flex-col gap-4">
          {ROADMAP.map((yr) => {
            const doneKeys = yr.tasks.map((_, i) => `${yr.id}_${i}`);
            const done = doneKeys.filter((k) => state.roadmap[k]).length;
            const pct = Math.round((done / yr.tasks.length) * 100);
            const isOpen = open === yr.id;

            return (
              <li key={yr.id} className="relative pl-10 md:pl-12">
                <span
                  className="absolute left-0 top-1 flex h-8 w-8 items-center justify-center rounded-full border-2 font-mono text-xs font-semibold md:h-10 md:w-10"
                  style={{ borderColor: yr.color, color: pct === 100 ? '#04150d' : yr.color, background: pct === 100 ? yr.color : 'var(--ink)' }}
                >
                  {pct === 100 ? <Check size={16} /> : yr.year.split(' ')[1]}
                </span>

                <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? null : yr.id)}
                    className="flex w-full items-center gap-3 p-4 text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[11px] text-[var(--slate)]">{yr.year} &middot; {yr.focus}</p>
                      <p className="font-display font-semibold text-lg" style={{ color: yr.color }}>{yr.label}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 shrink-0">
                      <div className="h-1.5 w-24 rounded-full bg-[var(--surface-2)] overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: yr.color }} />
                      </div>
                      <span className="font-mono text-xs text-[var(--slate)] w-9 text-right">{pct}%</span>
                    </div>
                    <ChevronDown size={18} className={`shrink-0 text-[var(--slate)] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="sm:hidden px-4 pb-3 -mt-2 flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-[var(--surface-2)] overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: yr.color }} />
                    </div>
                    <span className="font-mono text-xs text-[var(--slate)]">{pct}%</span>
                  </div>

                  {isOpen && (
                    <ul className="border-t border-[var(--line)] p-2">
                      {yr.tasks.map((task, i) => {
                        const key = `${yr.id}_${i}`;
                        const checked = Boolean(state.roadmap[key]);
                        return (
                          <li key={key}>
                            <button
                              onClick={() => toggleRoadmapTask(key)}
                              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-[var(--surface-2)]/60 transition-colors"
                            >
                              <span
                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors"
                                style={{ borderColor: checked ? yr.color : 'rgba(139,150,168,0.5)', background: checked ? yr.color : 'transparent', color: '#04150d' }}
                              >
                                {checked && <Check size={12} strokeWidth={3} />}
                              </span>
                              <span className={`text-sm ${checked ? 'text-[var(--slate)] line-through' : ''}`}>{task}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
