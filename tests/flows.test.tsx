import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { App } from '../src/App';
function mount(path = '/') {
  window.history.replaceState({}, '', path);
  return render(<App />);
}
function openBooking() {
  fireEvent.click(document.querySelector('.header-book')!);
  return screen.getByRole('dialog', { name: 'Il tuo soggiorno.' });
}
function advanceToDates(dialog: HTMLElement) {
  fireEvent.click(within(dialog).getByRole('button', { name: /Trova il tuo rifugio/ }));
  fireEvent.click(within(dialog).getByRole('button', { name: /Scegli le date/ }));
}
describe('Visitor flows in a DOM simulation', () => {
  it('renders one primary heading and supplied identity on every route', () => {
    const routes = ['/', '/suite', '/suite/suite-bosco', '/suite/suite-dolomiti', '/suite/suite-panorama', '/spa', '/health-club', '/ristoranti', '/wine-library', '/cigar-library', '/esperienze', '/galleria', '/contatti', '/missing'];
    for (const route of routes) {
      const result = mount(route);
      expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
      expect(screen.getAllByAltText('MEMENTO — Dolomites Retreat').length).toBeGreaterThan(0);
      expect(document.querySelector('a[href="mailto:"]')).toBeNull();
      result.unmount();
    }
  });
  it('validates the booking and reaches an explicit simulation summary', async () => {
    mount('/suite/suite-dolomiti');
    fireEvent.click(screen.getByRole('button', { name: /Immagina il tuo soggiorno/ }));
    const dialog = screen.getByRole('dialog', { name: 'Il tuo soggiorno.' });
    const scope = within(dialog);
    advanceToDates(dialog);
    fireEvent.click(scope.getByRole('button', { name: /Visualizza riepilogo/ }));
    expect(scope.getByText('Scegli una data di arrivo valida.')).toBeInTheDocument();
    fireEvent.change(scope.getByLabelText(/Arrivo/), { target: { value: '2099-05-01' } });
    fireEvent.change(scope.getByLabelText(/Partenza/), { target: { value: '2099-05-04' } });
    fireEvent.click(scope.getByRole('button', { name: /Visualizza riepilogo/ }));
    expect(scope.getByText('Simulazione completata. Nessuna prenotazione è stata effettuata.')).toBeInTheDocument();
    expect(scope.getByRole('heading', { name: 'Suite Dolomiti' })).toBeInTheDocument();
    expect(scope.getByText('Spa e rituali')).toBeInTheDocument();
    fireEvent.click(scope.getByRole('button', { name: /Modifica le tue scelte/ }));
    expect(scope.getByLabelText(/Arrivo/)).toHaveValue('2099-05-01');
  });
  it('keeps dates and suite across season changes without scrolling', async () => {
    mount('/suite/suite-bosco');
    fireEvent.click(screen.getByRole('button', { name: /Immagina il tuo soggiorno/ }));
    let dialog = screen.getByRole('dialog', { name: 'Il tuo soggiorno.' });
    advanceToDates(dialog);
    fireEvent.change(within(dialog).getByLabelText(/Arrivo/), { target: { value: '2099-07-08' } });
    fireEvent.change(within(dialog).getByLabelText(/Partenza/), { target: { value: '2099-07-10' } });
    fireEvent.click(within(dialog).getByRole('button', { name: 'Chiudi il soggiorno' }));
    vi.mocked(window.scrollTo).mockClear();
    await act(async () => { fireEvent.click(screen.getAllByRole('button', { name: 'Inverno' })[0]); });
    await waitFor(() => expect(window.location.search).toContain('season=winter'));
    expect(window.scrollTo).not.toHaveBeenCalled();
    dialog = openBooking();
    fireEvent.click(within(dialog).getByRole('button', { name: /Trova il tuo rifugio/ }));
    expect(within(dialog).getByRole('button', { name: /Chalet Bosco/ })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(within(dialog).getByRole('button', { name: /Scegli le date/ }));
    expect(within(dialog).getByLabelText(/Arrivo/)).toHaveValue('2099-07-08');
    expect(localStorage.getItem('memento-mountain-season')).toBe('winter');
  });
  it('navigates through the menu and preserves booking context from a service', () => {
    mount();
    fireEvent.click(screen.getByRole('button', { name: 'Apri il menu' }));
    const menu = screen.getByRole('dialog', { name: 'Il tuo mondo, più piano.' });
    fireEvent.click(within(menu).getByRole('link', { name: /Health Club e personal training/ }));
    expect(window.location.pathname).toBe('/health-club');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Ritrovare il proprio equilibrio.');
    fireEvent.click(screen.getByRole('button', { name: /Aggiungi al soggiorno/ }));
    const dialog = screen.getByRole('dialog', { name: 'Il tuo soggiorno.' });
    advanceToDates(dialog);
    fireEvent.click(within(dialog).getByText('Un piccolo desiderio in più'));
    expect(within(dialog).getByLabelText('Health Club e personal training')).toBeChecked();
  });
  it('opens a day moment with matching copy, then carries its intention into the planner', () => {
    mount('/');
    fireEvent.click(screen.getByRole('button', { name: 'Apri il momento: Ancora cinque minuti.' }));
    const moment = screen.getByRole('dialog', { name: 'Ancora cinque minuti.' });
    expect(within(moment).getByText(/Si comincia con un aperitivo/)).toBeInTheDocument();
    fireEvent.click(within(moment).getByRole('button', { name: /Voglio un momento così/ }));
    const planner = screen.getByRole('dialog', { name: 'Il tuo soggiorno.' });
    expect(within(planner).getByRole('button', { name: /In buona compagnia/ })).toHaveAttribute('aria-pressed', 'true');
    advanceToDates(planner);
    fireEvent.click(within(planner).getByText('Un piccolo desiderio in più'));
    expect(within(planner).getByLabelText('Ristoranti e alta cucina')).toBeChecked();
  });
  it('filters photographs and supports lightbox keyboard controls and Escape', () => {
    mount('/galleria');
    fireEvent.click(screen.getByRole('button', { name: 'Benessere' }));
    expect(document.querySelectorAll('.gallery-item')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: 'Stagioni' }));
    fireEvent.click(screen.getByRole('button', { name: 'Apri il paesaggio estivo' }));
    const lightbox = screen.getByRole('dialog', { name: 'MEMENTO · Estate' });
    fireEvent.keyDown(lightbox.querySelector('.lightbox-content')!, { key: 'ArrowRight' });
    expect(within(lightbox).getByRole('heading')).toHaveTextContent('MEMENTO · Inverno');
    fireEvent(lightbox, new Event('cancel', { cancelable: true }));
    expect(lightbox).not.toHaveAttribute('open');
  });
});
