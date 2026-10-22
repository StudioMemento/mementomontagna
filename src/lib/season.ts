import { isSeason, type Season } from '../data/catalog';
export const storageKey = 'memento-mountain-season';
export function initialSeason(search: string, stored: unknown): Season {
  const query = new URLSearchParams(search).get('season');
  return isSeason(query) ? query : isSeason(stored) ? stored : 'summer';
}
/** Each intent invalidates previous async decodes, including returning to the current season. */
export class SeasonRequests {
  private id = 0;
  async request(next: Season, decode: () => Promise<void>, commit: (season: Season) => void) {
    const requestId = ++this.id;
    try {
      await decode();
      if (requestId !== this.id) return 'stale';
      commit(next);
      return 'committed';
    } catch {
      return requestId === this.id ? 'failed' : 'stale';
    }
  }
}
