import { useEffect, useState } from 'react';
import { auth, onAuthStateChanged, firebaseConfigured } from '../firebase';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(!firebaseConfigured);

  useEffect(() => {
    if (!firebaseConfigured) return;
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return unsub;
  }, []);

  return { user, ready };
}
