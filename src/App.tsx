import { useEffect, useRef, useState } from 'react';
import { content } from './data/catalog';
import { Header, Menu } from './components/Header';
import { Footer } from './components/Footer';
import { Booking } from './components/Booking';
import { Arrow } from './components/UI';
import { ExperiencesPreview, type BookAction } from './pages/Home';
import { Home } from './pages/Journey';
import { ContactsPage, NotFound, ServicePage, SuitePage, SuitesPage } from './pages/Details';
import { GalleryPage } from './pages/Gallery';
import { SeasonProvider, useSeason } from './hooks/useSeason';
import { useMotion } from './hooks/useMotion';
import { RouterProvider, useRouter } from './lib/router';
import { emptyBooking, type BookingDraft } from './lib/booking';
function Site() {
  const { path } = useRouter();
  const { announcement } = useSeason();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [draft, setDraft] = useState<BookingDraft>({ ...emptyBooking, interests: [] });
  const main = useRef<HTMLElement>(null);
  const previousPath = useRef(path);
  useMotion(main, path);
  useEffect(() => {
    const service = content.services.find(s => path === `/${s.id}`);
    const room = content.rooms.find(r => path === `/suite/${r.id}`);
    const titles: Record<string, string> = { '/suite': 'I rifugi', '/esperienze': 'Esperienze', '/galleria': 'Galleria', '/contatti': 'Concierge' };
    const title = service?.label || room?.name || titles[path];
    document.title = title ? `${title} · MEMENTO Dolomites Retreat` : 'MEMENTO · Dolomites Retreat';
    if (previousPath.current !== path) { main.current?.focus({ preventScroll: true }); previousPath.current = path; }
  }, [path]);
  const onBook: BookAction = (context = {}) => {
    setMenuOpen(false);
    setDraft(current => ({ ...current, roomId: context.roomId || current.roomId, interests: context.interest && !current.interests.includes(context.interest) ? [...current.interests, context.interest] : current.interests }));
    setBookingOpen(true);
  };
  let page;
  if (path === '/') page = <Home onBook={onBook} draft={draft} />;
  else if (path === '/suite') page = <SuitesPage onBook={onBook} />;
  else if (path.startsWith('/suite/') && content.rooms.some(r => path === `/suite/${r.id}`)) page = <SuitePage id={path.split('/')[2]} onBook={onBook} />;
  else if (content.services.some(s => path === `/${s.id}`)) page = <ServicePage id={path.slice(1)} onBook={onBook} />;
  else if (path === '/esperienze') page = <ExperiencesPreview onBook={onBook} standalone />;
  else if (path === '/galleria') page = <GalleryPage />;
  else if (path === '/contatti') page = <ContactsPage onBook={onBook} />;
  else page = <NotFound />;
  return <><a className="skip-link" href="#main">Vai al contenuto</a><Header onMenu={() => setMenuOpen(true)} onBook={() => onBook()} /><main id="main" ref={main} tabIndex={-1} key={path}>{page}</main><Footer onBook={() => onBook()} /><div className="mobile-booking"><span>La montagna ti aspetta.</span><button className="button primary" onClick={() => onBook()}>Disegna la tua pausa <Arrow /></button></div><div className="sr-only" role="status" aria-live="polite">{announcement}</div><Menu open={menuOpen} onClose={() => setMenuOpen(false)} onBook={() => onBook()} /><Booking open={bookingOpen} onClose={() => setBookingOpen(false)} draft={draft} setDraft={setDraft} /></>;
}
export function App() {
  return <SeasonProvider><RouterProvider><Site /></RouterProvider></SeasonProvider>;
}
