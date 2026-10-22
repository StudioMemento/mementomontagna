import { allInterestOptions, content, type Season } from '../data/catalog';
export type BookingDraft = { arrival: string; departure: string; adults: number; roomId: string; interests: string[]; notes: string; mood?: string };
export const emptyBooking: BookingDraft = { arrival: '', departure: '', adults: 2, roomId: '', interests: [], notes: '' };
export function todayRome(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
  return ['year', 'month', 'day'].map(type => parts.find(p => p.type === type)!.value).join('-');
}
export function isDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}
export function unavailableInterests(draft: BookingDraft, season: Season) {
  return allInterestOptions.filter(i => draft.interests.includes(i.id) && i.season && i.season !== season);
}
export function validateBooking(draft: BookingDraft, season: Season, today = todayRome()) {
  const errors: Record<string, string> = {};
  if (!isDate(draft.arrival)) errors.arrival = 'Scegli una data di arrivo valida.';
  else if (draft.arrival < today) errors.arrival = 'L’arrivo deve essere oggi o in una data futura.';
  if (!isDate(draft.departure)) errors.departure = 'Scegli una data di partenza valida.';
  else if (isDate(draft.arrival) && draft.departure <= draft.arrival) errors.departure = 'La partenza deve essere successiva all’arrivo.';
  if (!Number.isInteger(draft.adults) || draft.adults < 1 || draft.adults > 6) errors.adults = 'Scegli da 1 a 6 adulti per questa demo.';
  if (draft.roomId && !content.rooms.some(r => r.id === draft.roomId)) errors.roomId = 'Scegli una delle suite proposte.';
  const unavailable = unavailableInterests(draft, season);
  if (unavailable.length) errors.interests = `${unavailable.map(i => i.name).join(', ')}: proposta per l’altra stagione. Rimuovila oppure cambia stagione prima di continuare.`;
  return errors;
}
export function formatDate(value: string) {
  if (!isDate(value)) return 'Da scegliere';
  return new Intl.DateTimeFormat('it-IT', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Rome' }).format(new Date(`${value}T12:00:00Z`));
}
