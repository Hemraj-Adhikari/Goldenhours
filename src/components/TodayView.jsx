import { useEffect, useState } from 'react';
import { Check, Zap } from 'lucide-react';
import { tasksForDay, dateKey } from '../data/plan';

function parseTimeRange(str) {
  // "10:00 AM – 7:30 PM" or "5:00 – 6:00 AM" or "10:30 PM" -> [startMinutes, endMinutes] or null
  const m = str.match(/(\d{1,2}:\d{2})\s*(AM|PM)?\s*(?:–|-)\s*(\d{1,2}:\d{2})\s*(AM|PM)/i);
  const single = str.match(/^(\d{1,2}:\d{2})\s*(AM|PM)$/i);
  const toMin = (t, mer) => {
    let [h, m2] = t.split(':').map(Number);
    if (mer) {
      mer = mer.toUpperCase();
      if (mer === 'PM' && h !== 12) h += 12;
      if (mer === 'AM' && h === 12) h = 0;
    }
    return h * 60 + m2;
  };
  if (m) {
    const merA = m[2] || m[4];
    const start = toMin(m[1], merA);
    const end = toMin(m[3], m[4]);
    return [start, end];
  }
  if (single) {
    const t = toMin(single[1], single[2]);
    return [t, t + 30];
  }
  return null;
}

export default function TodayView({ state, toggleTask, isDemo }) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  const key = dateKey(now);
  const { kind, tasks } = tasksForDay(now);
  const dayLog = state.logs[key] || {};
  const doneCount = tasks.filter((t) => dayLog[t.id]).length;
  const pct = Math.round((doneCount / tasks.length) * 100);
  const nowMin = now.getHours() * 60 + now.getMinutes();

  return (
    <div className="fade-up">
      <div className="flex flex-col gap-1 mb-6">
        <p className="font-mono text-xs text-[var(--slate)] uppercase tracking-widest">
          {now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} · {kind}
        </p>
        <h1 className="font-display text-3xl font-semibold">Today's blocks</h1>
      </div>

      <div className="mb-8 flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4">
        <div className="relative h-16 w-16 shrink-0">
          <svg viewBox="0 0 36 36" className="h-16 w-16 -rotate-90">
            <circle cx="18" cy="18" r="15.5" fill="none" stroke="var(--surface-2)" strokeWidth="3" />
            <circle
              cx="18" cy="18" r="15.5" fill="none"
              stroke="var(--amber)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${(pct / 100) * 97.4} 97.4`}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold">{pct}%</span>
        </div>
        <div>
          <p className="font-medium">{doneCount} of {tasks.length} blocks done</p>
          <p className="text-sm text-[var(--slate)]">
            {pct === 100 ? 'Full day, logged. Discipline compounds.' : 'Check each block off as you go.'}
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-3">
        {tasks.map((task) => {
          const range = parseTimeRange(task.time);
          const active = range && nowMin >= range[0] && nowMin < range[1];
          const done = Boolean(dayLog[task.id]);
          return (
            <li key={task.id}>
              <button
                onClick={() => toggleTask(key, task.id)}
                className={`group flex w-full items-start gap-4 rounded-2xl border p-4 text-left transition-colors ${
                  done
                    ? 'border-[var(--green-soft)] bg-[var(--green)]/[0.07]'
                    : task.highlight
                    ? 'border-[var(--amber-soft)] bg-[var(--amber)]/[0.06]'
                    : 'border-[var(--line)] bg-[var(--surface)] hover:border-[var(--slate)]/50'
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    done ? 'border-[var(--green)] bg-[var(--green)] text-[#04150d]' : 'border-[var(--slate)]/50'
                  }`}
                >
                  {done && <Check size={14} strokeWidth={3} />}
                </span>
                <span className="flex-1 min-w-0">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[11px] text-[var(--slate)]">{task.time}</span>
                    {active && !done && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--amber)]/15 px-2 py-0.5 text-[10px] font-mono font-medium text-[var(--amber)]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--amber)] pulse-dot" /> now
                      </span>
                    )}
                    {task.highlight && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[var(--amber)]">
                        <Zap size={11} /> golden
                      </span>
                    )}
                  </span>
                  <span className={`mt-1 block font-medium ${done ? 'line-through decoration-[var(--green)]/60 text-[var(--slate)]' : ''}`}>
                    {task.title}
                  </span>
                  <span className="mt-0.5 block text-sm text-[var(--slate)]">{task.detail}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {isDemo && (
        <p className="mt-6 text-center text-xs text-[var(--slate)] font-mono">
          demo mode — this device only
        </p>
      )}
    </div>
  );
}
