import { useCallback, useRef, useState } from 'react';

const DEFAULT_TTL_MS = 3000;

const useToasts = () => {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const t = timeoutsRef.current.get(id);
    if (t) clearTimeout(t);
    timeoutsRef.current.delete(id);
  }, []);

  const push = useCallback((toast) => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const ttl = toast.ttlMs ?? DEFAULT_TTL_MS;
    const next = { id, type: toast.type || 'info', message: toast.message || '', title: toast.title, ttlMs: ttl };

    setToasts((prev) => [next, ...prev].slice(0, 5)); // cap to 5

    const timeout = setTimeout(() => dismiss(id), ttl);
    timeoutsRef.current.set(id, timeout);

    return id;
  }, [dismiss]);

  return { toasts, push, dismiss };
};

export default useToasts;


