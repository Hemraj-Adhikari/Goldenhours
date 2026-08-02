import { Sunrise, Map, Flame, LogIn, LogOut, User } from 'lucide-react';

const NAV = [
  { id: 'today', label: 'Today', icon: Sunrise },
  { id: 'roadmap', label: 'Roadmap', icon: Map },
  { id: 'consistency', label: 'Consistency', icon: Flame },
];

export default function Sidebar({ view, setView, user, isDemo, onLogin, onLogout }) {
  return (
    <aside className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-around border-t border-[var(--line)] bg-[var(--surface)]/95 backdrop-blur px-2 py-2 md:static md:flex md:h-screen md:w-64 md:flex-col md:justify-start md:border-r md:border-t-0 md:px-4 md:py-6">
      <div className="hidden md:flex md:flex-col md:gap-1 md:mb-8">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-[var(--amber)] pulse-dot" />
          <span className="font-display text-lg font-semibold tracking-tight">Golden Hours</span>
        </div>
        <p className="text-xs text-[var(--slate)] font-mono pl-4.5">4-year FAANG grind</p>
      </div>

      <nav className="flex w-full md:flex-col md:gap-1">
        {NAV.map(({ id, label, icon: Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex flex-1 md:flex-none flex-col md:flex-row items-center md:items-center gap-1 md:gap-3 rounded-xl px-3 py-2 md:py-2.5 text-xs md:text-sm transition-colors ${
                active
                  ? 'bg-[var(--surface-2)] text-[var(--amber)]'
                  : 'text-[var(--slate)] hover:text-[var(--paper)] hover:bg-[var(--surface-2)]/60'
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.4 : 1.8} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="hidden md:block md:mt-auto md:pt-6 md:border-t md:border-[var(--line)]">
        {user ? (
          <div className="flex items-center gap-2">
            {user.photoURL ? (
              <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full" referrerPolicy="no-referrer" />
            ) : (
              <div className="h-8 w-8 rounded-full bg-[var(--surface-2)] flex items-center justify-center">
                <User size={16} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{user.displayName || user.email}</p>
              <p className="text-[10px] text-[var(--slate)] font-mono">synced</p>
            </div>
            <button onClick={onLogout} aria-label="Sign out" className="p-1.5 text-[var(--slate)] hover:text-[var(--coral)]">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[var(--amber)] px-3 py-2 text-sm font-medium text-[#1a1206] hover:brightness-95 transition"
          >
            <LogIn size={16} /> Sync with Google
          </button>
        )}
        {isDemo && (
          <p className="mt-2 text-[10px] leading-snug text-[var(--slate)]">
            Saving on this device only. Sign in to sync across devices.
          </p>
        )}
      </div>
    </aside>
  );
}
