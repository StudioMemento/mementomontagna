import { describe, expect, it, vi } from 'vitest';
import { initialSeason, SeasonRequests } from '../src/lib/season';
describe('Season resolution and concurrency', () => {
  it('gives a valid URL precedence over valid storage and has a deterministic fallback', () => {
    expect(initialSeason('?season=winter', 'summer')).toBe('winter');
    expect(initialSeason('?season=wrong', 'winter')).toBe('winter');
    expect(initialSeason('?season=<script>', 'unknown')).toBe('summer');
  });
  it('commits only the last intent when image decodes finish out of order', async () => {
    const requests = new SeasonRequests();
    let finishWinter!: () => void;
    const commit = vi.fn();
    const first = requests.request('winter', () => new Promise<void>(resolve => { finishWinter = resolve; }), commit);
    const last = requests.request('summer', async () => {}, commit);
    expect(await last).toBe('committed');
    finishWinter();
    expect(await first).toBe('stale');
    expect(commit).toHaveBeenCalledExactlyOnceWith('summer');
  });
  it('preserves the current season on failure and allows a later retry', async () => {
    const requests = new SeasonRequests();
    const commit = vi.fn();
    expect(await requests.request('winter', async () => { throw Error('decode'); }, commit)).toBe('failed');
    expect(commit).not.toHaveBeenCalled();
    expect(await requests.request('winter', async () => {}, commit)).toBe('committed');
    expect(commit).toHaveBeenCalledExactlyOnceWith('winter');
  });
});
