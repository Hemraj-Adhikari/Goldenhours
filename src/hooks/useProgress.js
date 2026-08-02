import { useEffect, useRef, useState } from 'react';
import {
  db,
  doc,
  setDoc,
  onSnapshot,
  firebaseConfigured,
} from '../firebase';

const LOCAL_KEY = 'golden-hours-demo-state-v1';

function readLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : { logs: {}, roadmap: {} };
  } catch {
    return { logs: {}, roadmap: {} };
  }
}
function writeLocal(state) {
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
}

// Syncs { logs: { [dateKey]: { [taskId]: bool } }, roadmap: { [taskKey]: bool } }
// to Firestore at users/{uid}/state/data when signed in, otherwise to
// localStorage so the app is fully usable before Firebase is configured.
export function useProgress(user) {
  const [state, setState] = useState(() => readLocal());
  const [loading, setLoading] = useState(true);
  const unsubRef = useRef(null);

  useEffect(() => {
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!firebaseConfigured || !user) {
      setState(readLocal());
      setLoading(false);
      return;
    }

    setLoading(true);
    const ref = doc(db, 'users', user.uid, 'state', 'data');
    unsubRef.current = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setState({ logs: data.logs || {}, roadmap: data.roadmap || {} });
      } else {
        setState({ logs: {}, roadmap: {} });
      }
      setLoading(false);
    });

    return () => {
      if (unsubRef.current) unsubRef.current();
    };
  }, [user]);

  async function persist(next) {
    setState(next);
    if (firebaseConfigured && user) {
      const ref = doc(db, 'users', user.uid, 'state', 'data');
      await setDoc(ref, next, { merge: false });
    } else {
      writeLocal(next);
    }
  }

  function toggleTask(dateKey, taskId) {
    const dayLog = { ...(state.logs[dateKey] || {}) };
    dayLog[taskId] = !dayLog[taskId];
    const next = { ...state, logs: { ...state.logs, [dateKey]: dayLog } };
    persist(next);
  }

  function toggleRoadmapTask(taskKey) {
    const next = {
      ...state,
      roadmap: { ...state.roadmap, [taskKey]: !state.roadmap[taskKey] },
    };
    persist(next);
  }

  return { state, loading, toggleTask, toggleRoadmapTask, isDemo: !(firebaseConfigured && user) };
}
