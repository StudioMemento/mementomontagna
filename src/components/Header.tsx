import { useEffect, useState } from 'react';
import { content, seasonLabel } from '../data/catalog';
import { useSeason } from '../hooks/useSeason';
import { Link, useRouter } from '../lib/router';
import { Dialog } from './Dialog';
import { Arrow, Icon } from './UI';
export function SeasonSwitch({ compact = false }: { compact?: boolean }) {
  const { season, pending, changeSeason } = useSeason();
  return <div className={`season-switch ${compact ? 'season-switch-compact' : ''}`} role="group" aria-label="Scegli la stagione" aria-busy={pending !== null}>
    {(['summer', 'winter'] as const).map(s => <button key={s} type="button" className={season === s ? 'selected' : ''} aria-pressed={season === s} onClick={() => changeSeason(s)}><Icon name={s === 'summer' ? 'sun' : 'snow'} />{seasonLabel(s)}{pending === s && <span className="loading-dot" aria-label="Caricamento" />}</button>)}
  </div>;
}
export function Header({ onMenu, onBook }: { onMenu: () => void; onBook: () => void }) {
  const { path } = useRouter();
  const [scrolled, setScrolled] = useState(window.scrollY > 40);
  useEffect(() => { const update = () => setScrolled(window.scrollY > 40); window.addEventListener('scroll', update, { passive: true }); update(); return () => window.removeEventListener('scroll', update); }, [path]);
  const immersive = path === '/' || path === '/esperienze' || path.startsWith('/suite/') || content.services.some(s => path === `/${s.id}`);
  const transparent = immersive && !scrolled;
  const nav = [{href:'/#il-luogo',label:'Il retreat'},{href:'/suite',label:'Suite'},{href:'/spa',label:'Spa & benessere'},{href:'/health-club',label:'Health Club'},{href:'/ristoranti',label:'Ristoranti'},{href:'/wine-library',label:'Le Library'},{href:'/esperienze',label:'Esperienze'},{href:'/galleria',label:'Galleria'}];
  return <header className={`site-header ${transparent ? 'header-transparent' : 'header-solid'}`}>
    <div className="header-top"><div className="header-left"><button type="button" className="menu-trigger" onClick={onMenu} aria-label="Apri il menu"><Icon name="menu" /></button><div className="header-season"><span className="season-caption">IL TUO MEMENTO</span><SeasonSwitch compact /></div></div>
    <Link href="/" className="brand" aria-label="MEMENTO Dolomites Retreat, home"><img src={`/assets/brand/memento-lockup-${transparent ? 'light' : 'color'}.svg`} width="210" height="44" alt="MEMENTO — Dolomites Retreat" /></Link>
    <div className="header-right"><Link href="/contatti" className="header-concierge">Concierge</Link><button className="header-book" onClick={onBook}>Prenota<span> la tua pausa</span></button></div></div>
    <nav className="desktop-nav" aria-label="Esplora MEMENTO">{nav.map(n => <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>{n.label}</Link>)}</nav>
    <div className="mobile-seasons"><SeasonSwitch compact /></div>
  </header>;
}
export function Menu({ open, onClose, onBook }: { open: boolean; onClose: () => void; onBook: () => void }) {
  const { path } = useRouter();
  const items = [{ href: '/suite', title: 'Un posto tutto tuo', label: 'Chalet, suite e appartamenti' }, { href: '/spa', title: 'Lasciarsi andare', label: 'Spa e benessere' }, { href: '/ristoranti', title: 'Un posto a tavola', label: 'Cucina e Library' }, { href: '/esperienze', title: 'Fuori programma', label: 'Esperienze' }, { href: '/galleria', title: 'Custodire un istante', label: 'Galleria' }, { href: '/contatti', title: 'Cominciare il viaggio', label: 'Concierge' }];
  return <Dialog open={open} onClose={onClose} labelledBy="menu-title" className="menu-dialog">
    <div className="menu-content">
      <div className="dialog-top"><img src="/assets/brand/memento-lockup-color.svg" width="210" height="44" alt="MEMENTO — Dolomites Retreat" /><button className="close-button" onClick={onClose} data-autofocus>Chiudi <Icon name="close" /></button></div>
      <div className="menu-grid"><div><p className="small-label" id="menu-title">Il tuo mondo, più piano.</p><nav aria-label="Navigazione principale">{items.map((item, i) => <Link key={item.href} href={item.href} className="menu-item" aria-current={path === item.href ? 'page' : undefined} onClick={onClose}><span className="menu-number">0{i + 1}</span><span><span className="menu-item-title">{item.title}</span><span className="menu-item-label">{item.label}</span></span><Arrow /></Link>)}</nav></div>
      <aside className="menu-aside"><p className="serif">Un altro ritmo.<br />La stessa meraviglia.</p><SeasonSwitch /><div className="menu-service-links">{content.services.map(s => <Link href={`/${s.id}`} key={s.id} onClick={onClose}>{s.label}<Arrow /></Link>)}</div><button className="button primary" onClick={() => { onClose(); onBook(); }}>Componi il soggiorno <Arrow /></button></aside></div>
      <p className="menu-bottom">MEMENTO · DOLOMITES RETREAT <span>Un concept di ospitalità, firmato Memento Studio.</span></p>
    </div>
  </Dialog>;
}
