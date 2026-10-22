import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { heroSrc, heroSrcSet, seasonLabel, type Season } from '../data/catalog';
import { initialSeason, SeasonRequests, storageKey } from '../lib/season';
type SeasonContextValue = { season: Season; pending: Season | null; announcement: string; changeSeason: (next: Season) => void };
const SeasonContext = createContext<SeasonContextValue | null>(null);
export function SeasonProvider({ children }: { children: ReactNode }) {
  const [season, setSeason] = useState<Season>(() => {
    let saved: string | null = null;
    try { saved = localStorage.getItem(storageKey); } catch { /* optional storage */ }
    return initialSeason(window.location.search, saved);
  });
  const [pending, setPending] = useState<Season | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const requests = useRef(new SeasonRequests());
  const changeSeason = useCallback(async (next: Season) => {
    setPending(next);
    const result = await requests.current.request(next, async () => {
      const image = new Image();
      image.sizes = '(max-width: 1023px) 178vh, 100vw'; image.srcset = heroSrcSet(next); image.src = heroSrc(next);
      await image.decode();
    }, value => {
      setSeason(value);
      const url = new URL(window.location.href); url.searchParams.set('season', value);
      window.history.replaceState(window.history.state, '', url);
      try { localStorage.setItem(storageKey, value); } catch { /* optional storage */ }
      setAnnouncement(`Esperienza ${seasonLabel(value).toLowerCase()} attiva.`);
    });
    if (result === 'stale') return;
    setPending(null);
    if (result === 'failed') setAnnouncement('La foto non è stata caricata. La stagione precedente rimane attiva: puoi riprovare.');
  }, []);
  return <SeasonContext.Provider value={{ season, pending, announcement, changeSeason }}>{children}</SeasonContext.Provider>;
}
export function useSeason() {
  const value = useContext(SeasonContext);
  if (!value) throw new Error('SeasonProvider required');
  return value;
}
