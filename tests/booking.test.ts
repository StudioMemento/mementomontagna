import { describe, expect, it } from 'vitest';
import { emptyBooking, formatDate, todayRome, validateBooking } from '../src/lib/booking';
const valid = { ...emptyBooking, arrival: '2099-05-01', departure: '2099-05-04', adults: 2, interests: [] };
describe('Booking validation', () => {
  it('uses the date in Rome across UTC day boundaries', () => {
    expect(todayRome(new Date('2026-10-16T22:30:00Z'))).toBe('2026-10-17');
    expect(todayRome(new Date('2026-01-01T23:30:00Z'))).toBe('2026-01-02');
  });
  it('accepts valid requests and formats dates without shifting the day', () => {
    expect(validateBooking(valid, 'summer', '2099-04-30')).toEqual({});
    expect(formatDate(valid.arrival)).toBe('1 maggio 2099');
  });
  it('rejects missing, past, impossible, equal and reversed dates', () => {
    expect(validateBooking({ ...valid, arrival: '' }, 'summer').arrival).toBeTruthy();
    expect(validateBooking({ ...valid, arrival: '2025-01-01' }, 'summer', '2026-10-16').arrival).toMatch(/futura/);
    expect(validateBooking({ ...valid, arrival: '2099-02-31' }, 'summer').arrival).toMatch(/valida/);
    expect(validateBooking({ ...valid, departure: valid.arrival }, 'summer').departure).toMatch(/successiva/);
    expect(validateBooking({ ...valid, departure: '2099-04-30' }, 'summer').departure).toMatch(/successiva/);
  });
  it('rejects unavailable seasonal interests without deleting the selections', () => {
    const draft = { ...valid, interests: ['spa', 'sentieri'] };
    expect(validateBooking(draft, 'winter').interests).toContain('altra stagione');
    expect(draft.interests).toEqual(['spa', 'sentieri']);
    expect(validateBooking(draft, 'summer')).toEqual({});
  });
  it('rejects invalid party sizes and suite ids', () => {
    for (const adults of [0, 7, 2.5, NaN]) expect(validateBooking({ ...valid, adults }, 'summer').adults).toBeTruthy();
    expect(validateBooking({ ...valid, roomId: 'missing' }, 'summer').roomId).toBeTruthy();
  });
});
