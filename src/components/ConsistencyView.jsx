import { useMemo, useState } from 'react';
import { Flame, Trophy } from 'lucide-react';
import { tasksForDay, dateKey } from '../data/plan';

const WEEKS = 20;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function pctForDate(state, d) {
  const { tasks } = tasksForDay(d);
  const log = state.logs[dateKey(d)] || {};
  const done = tasks.filter((t) => log[t.id]).length;
  return tasks.length ? done / tasks.length : 0;
}

function levelFor(pct) {
  if (pct <= 0) return 0;
  if (pct < 0.34) return 1;
  if (pct < 0.67) return 2;
  if (pct < 1) return 3;
  return 4;
}

const LEVEL_COLOR = [
  'var(--surface-2)',
  'rgba(240,169,58,0.25)',
  'rgba(240,169,58,0.5)',
  'rgba(240,169,58,0.75)',
  'var(--amber)',
];

export default function ConsistencyView({ state }) {
  const [hover, setHover] = useState(null);

  const { weeks, current, best, totalDays } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const end = new Date(today);
    // align end to the coming Saturday so grid columns are full weeks
    end.setDate(end.getDate() + (6 - end.getDay()));
    const start = new Date(end);
    start.setDate(start.getDate() - WEEKS * 7 + 1);

    const days = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }

    const cols = [];
    for (let i = 0; i < days.length; i += 7) {
      cols.push(days.slice(i, i + 7));
    }

    // streaks (only count days up to today, full days = 100% complete)
    let current = 0;
    let best = 0;
    let running = 0;
    let totalDays = 0;
    const chronological = days.filter((d) => d <= today);
    chronological.forEach((d) => {
      const pct = pctForDate(state, d);
      if (pct > 0) totalDays += 1;
      if (pct >= 1) {
        running += 1;
        best = Math.max(best, running);
      } else {
        running = 0;
      }
    });
    // current streak = walk back from today
    for (let i = chronological.length - 1; i >= 0; i--) {
      if (pctForDate(state, chronological[i]) >= 1) current += 1;
      else break;
    }

    return { weeks: cols, current, best, totalDays };
  }, [state]);

  return (
    <div className="fade-up">
      <div className="mb-6">
        <p className="font-mono text-xs text-[var(--slate)] uppercase tracking-widest">Discipline, visualized</p>
        <h1 className="font-display text-3xl font-semibold">Consistency graph</h1>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-3">
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-2 text-[var(--amber)]">
            <Flame size={18} />
            <span className="font-mono text-2xl font-semibold">{current}</span>
          </div>
          <p className="mt-1 text-xs text-[var(--slate)]">current streak</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <div className="flex items-center gap-2 text-[var(--green)]">
            <Trophy size={18} />
            <span className="font-mono text-2xl font-semibold">{best}</span>
          </div>
          <p className="mt-1 text-xs text-[var(--slate)]">best streak</p>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
          <span className="font-mono text-2xl font-semibold text-[var(--paper)]">{totalDays}</span>
          <p className="mt-1 text-xs text-[var(--slate)]">active days ({WEEKS}w)</p>
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 overflow-x-auto">
        <div className="flex gap-[3px] min-w-max">
          <div className="flex flex-col gap-[3px] pr-1 pt-[18px]">
            {DAY_LABELS.map((l, i) => (
              <span key={i} className="h-[13px] text-[9px] leading-[13px] font-mono text-[var(--slate)]">{l}</span>
            ))}
          </div>
          {weeks.map((col, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              <span className="h-[14px] block text-[9px] font-mono text-[var(--slate)]">
                {col[0].getDate() <= 7 ? col[0].toLocaleDateString(undefined, { month: 'short' }) : ''}
              </span>
              {col.map((d, di) => {
                const future = d > new Date();
                const pct = future ? -1 : pctForDate(state, d);
                const lvl = future ? -1 : levelFor(pct);
                const key = `${wi}-${di}`;
                return (
                  <div
                    key={key}
                    onMouseEnter={() => setHover({ d, pct })}
                    onMouseLeave={() => setHover(null)}
                    className="h-[13px] w-[13px] rounded-[3px] border border-black/10"
                    style={{ background: future ? 'transparent' : LEVEL_COLOR[lvl] }}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between">
          <p className="h-4 font-mono text-[11px] text-[var(--slate)]">
            {hover
              ? `${hover.d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} — ${Math.round(hover.pct * 100)}%`
              : '\u00A0'}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-[10px] text-[var(--slate)] font-mono">less</span>
            {LEVEL_COLOR.map((c, i) => (
              <span key={i} className="h-[11px] w-[11px] rounded-[3px]" style={{ background: c }} />
            ))}
            <span className="text-[10px] text-[var(--slate)] font-mono">more</span>
          </div>
        </div>
      </div>
    </div>
  );
}
