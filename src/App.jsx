import { useState } from 'react';
import Sidebar from './components/Sidebar';
import TodayView from './components/TodayView';
import RoadmapView from './components/RoadmapView';
import ConsistencyView from './components/ConsistencyView';
import { useAuth } from './hooks/useAuth';
import { useProgress } from './hooks/useProgress';
import { loginWithGoogle, logout, firebaseConfigured } from './firebase';

export default function App() {
  const [view, setView] = useState('today');
  const { user, ready } = useAuth();
  const { state, loading, toggleTask, toggleRoadmapTask, isDemo } = useProgress(user);

  async function onLogin() {
    try {
      await loginWithGoogle();
    } catch (e) {
      console.error(e);
    }
  }

  if (!ready || loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--amber)] pulse-dot" />
      </div>
    );
  }

  return (
    <div className="md:flex">
      <Sidebar
        view={view}
        setView={setView}
        user={user}
        isDemo={isDemo}
        onLogin={onLogin}
        onLogout={logout}
      />

      <main className="flex-1 px-5 pt-6 pb-24 md:px-10 md:py-10 max-w-3xl mx-auto w-full">
        {!firebaseConfigured && (
          <div className="mb-6 rounded-xl border border-[var(--amber-soft)] bg-[var(--amber)]/[0.08] px-4 py-3 text-xs leading-relaxed text-[var(--slate)]">
            <span className="text-[var(--amber)] font-medium">Demo mode.</span> Firebase isn't
            connected yet, so progress is only saved in this browser. Follow{' '}
            <span className="font-mono">README.md</span> to connect Firebase and sync across devices.
          </div>
        )}

        {view === 'today' && <TodayView state={state} toggleTask={toggleTask} isDemo={isDemo} />}
        {view === 'roadmap' && <RoadmapView state={state} toggleRoadmapTask={toggleRoadmapTask} />}
        {view === 'consistency' && <ConsistencyView state={state} />}
      </main>
    </div>
  );
}
