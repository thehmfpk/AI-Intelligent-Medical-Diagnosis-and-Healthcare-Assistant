import { useEffect, useState } from 'react';

/** useState that survives page changes / reloads via localStorage (never throws). */
export function usePersistentState<T>(key: string, initial: T, storage: 'local' | 'session' = 'local') {
  const read = (): T => {
    try {
      const store = storage === 'local' ? window.localStorage : window.sessionStorage;
      const raw = store.getItem(key);
      return raw === null ? initial : (JSON.parse(raw) as T);
    } catch {
      return initial;
    }
  };

  const [value, setValue] = useState<T>(read);

  useEffect(() => {
    try {
      const store = storage === 'local' ? window.localStorage : window.sessionStorage;
      store.setItem(key, JSON.stringify(value));
    } catch {
      /* storage full or blocked - ignore */
    }
  }, [key, value, storage]);

  return [value, setValue] as const;
}
