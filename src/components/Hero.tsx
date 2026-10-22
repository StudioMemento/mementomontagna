import { useEffect, useState } from 'react';
import { heroSrc, heroSrcSet, type Season } from '../data/catalog';
import { useSeason } from '../hooks/useSeason';
import { formatDate, type BookingDraft } from '../lib/booking';
import { Arrow, Icon, Photo } from './UI';
export function Landscape({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  const { season } = useSeason();
  const [previous, setPrevious] = useState<Season | null>(null);
  const [rendered, setRendered] = useState(season);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (season === rendered) return;
    setPrevious(rendered); setRendered(season); setFailed(false);
  }, [season, rendered]);
  useEffect(() => {
    if (!previous) return;
    const timer = window.setTimeout(() => setPrevious(null), 950);
    return () => clearTimeout(timer);
  }, [previous, rendered]);
  return <div className={`landscape ${className}`}>
    {previous && <img className="landscape-image" src={heroSrc(previous)} srcSet={heroSrcSet(previous)} sizes="(max-width: 1023px) 178vh, 100vw" width="1672" height="941" alt="" aria-hidden="true" />}
    <img key={rendered} className={`landscape-image ${previous ? 'incoming-image' : ''}`} src={heroSrc(rendered)} srcSet={heroSrcSet(rendered)} sizes="(max-width: 1023px) 178vh, 100vw" width="1672" height="941" alt={`Lodge MEMENTO e panorama dolomitico ${rendered === 'summer' ? 'in estate' : 'innevato'}.`} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onError={e => { if (!failed) { setFailed(true); e.currentTarget.srcset = ''; e.currentTarget.src = heroSrc(rendered === 'winter' ? 'summer' : 'winter', 1200); } }} />
  </div>;
}
export function Hero({ onBook, draft }: { onBook: () => void; draft: BookingDraft }) {
  const { season } = useSeason();
  const [slide, setSlide] = useState(0);
  const labels = ['Il nostro rifugio', 'Abitare il paesaggio', 'Il tempo di ritrovarsi'];
  return <><section className="hero" aria-labelledby="hero-title">
    <div className="hero-photos">{slide === 0 ? <Landscape priority /> : <Photo key={slide} id={slide === 1 ? 'suite-panorama' : 'spa-care'} priority />}</div><div className="hero-shade" />
    <div className="hero-content"><p className="hero-kicker">MEMENTO · DOLOMITES RETREAT</p><h1 id="hero-title">Il silenzio, finalmente.</h1><p className="hero-subtitle">Un rifugio per ritrovare il proprio ritmo.</p></div>
    <div className="hero-bottom"><span className="hero-location">DOLOMITI, {season === 'summer' ? 'LA LUCE D’ESTATE' : 'LA QUIETE D’INVERNO'}</span><a href="#il-luogo" className="hero-explore" aria-label="Esplora MEMENTO"><span>SCOPRI IL RETREAT</span><Arrow down /></a><div className="hero-slides" role="group" aria-label="Fotografie del retreat">{labels.map((label,i)=><button key={label} onClick={()=>setSlide(i)} aria-label={label} aria-pressed={slide===i}>0{i+1}</button>)}</div></div>
  </section><div className="booking-strip"><span className="booking-strip-label">Il tuo prossimo<br/><em>ricordo.</em></span><button className="booking-quick-field" onClick={onBook}><Icon name="calendar"/><span><small>ARRIVO</small>{draft.arrival ? formatDate(draft.arrival) : 'Scegli la data'}</span><Icon name="down"/></button><button className="booking-quick-field" onClick={onBook}><Icon name="calendar"/><span><small>PARTENZA</small>{draft.departure ? formatDate(draft.departure) : 'Scegli la data'}</span><Icon name="down"/></button><button className="booking-quick-field" onClick={onBook}><Icon name="guests"/><span><small>OSPITI</small>{draft.adults} {draft.adults === 1 ? 'ospite' : 'ospiti'}</span><Icon name="down"/></button><button className="button bronze" onClick={onBook}>Componi il soggiorno <Arrow/></button></div></>;
}
