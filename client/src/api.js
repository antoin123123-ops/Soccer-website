import { useEffect, useState } from 'react';

export function useApi(path) {
  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fetch(`/api${path}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`Request failed (${res.status})`))))
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }));
    return () => {
      cancelled = true;
    };
  }, [path]);

  return state;
}

export const formatDate = (iso, opts = { weekday: 'short', month: 'short', day: 'numeric' }) =>
  new Date(iso).toLocaleDateString(undefined, opts);

export const formatTime = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

let teamsPromise;
export function useTeams() {
  const [teams, setTeams] = useState(null);
  useEffect(() => {
    teamsPromise ??= fetch('/api/teams').then((res) => res.json());
    teamsPromise
      .then((list) => setTeams(Object.fromEntries(list.map((t) => [t.id, t]))))
      .catch(() => {
        teamsPromise = undefined;
      });
  }, []);
  return teams;
}
