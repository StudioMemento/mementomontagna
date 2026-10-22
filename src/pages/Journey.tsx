import { useEffect, useRef, useState } from 'react';
import { content, roomPhoto, type PhotoId } from '../data/catalog';
import { useSeason } from '../hooks/useSeason';
import { useJourneyMotion } from '../hooks/useJourneyMotion';
import { Link } from '../lib/router';
import { Landscape } from '../components/Hero';
import { SeasonSwitch } from '../components/Header';
import { Photo, Arrow, Icon } from '../components/UI';
import { Dialog } from '../components/Dialog';
import type { BookAction } from './Home';
import type { BookingDraft } from '../lib/booking';

const chapters = [
  ['arrivo','Arrivare'],['il-luogo','Rallentare'],['rifugi','Abitare'],['benessere','Lasciarsi andare'],['giornate','Perdersi'],['a-tavola','Ritrovarsi'],['il-tuo-memento','Partire davvero'],
];
const momentParagraphs = [
  ['Lascia le scarpe all’ingresso, scegli la tua coperta e avvicinati al fuoco. Fuori il paesaggio cambia lentamente; dentro, anche una tazza calda diventa un piccolo rito.', 'Puoi aprire un libro, raccontarti la sera prima o restare in silenzio. Questa mattina non ha una tabella di marcia. Ha soltanto il tuo ritmo.'],
  ['A volte basta seguire una curva per trovare un punto di vista nuovo. La luce tra gli alberi, il suono dei passi, una sosta che dura più del previsto: il bello è anche nel tragitto.', 'Porta con te qualcosa di buono, scegli un percorso adatto alla giornata e lascia un po’ di spazio alle sorprese. Al ritorno, il tuo rifugio sembrerà ancora più accogliente.'],
  ['Si comincia con un aperitivo e un posto in terrazza. Poi arrivano qualcosa da assaggiare, una storia che fa ridere e quella luce sulle cime che cambia ogni minuto.', 'Il telefono può servire per una foto, poi torna in tasca. Restano le voci, i bicchieri che si incontrano e la voglia di ordinare ancora qualcosa da condividere.'],
];
const roomTypes = ['Chalet','Suite','Appartamento'];
const roomLines = ['Il profumo del legno. Il bosco alla finestra. Un piccolo mondo, soltanto vostro.','Le cime al risveglio, una vasca al ritorno. E il lusso di perdere la cognizione del tempo.','Un living da condividere, la terrazza aperta sul cielo. Lo spazio per sentirsi a casa, insieme.'];
export function Home({onBook,draft}:{onBook:BookAction;draft:BookingDraft}) {
  const {season} = useSeason();
  const root=useRef<HTMLDivElement>(null);
  const [room,setRoom]=useState(0);
  const [active,setActive]=useState(0);
  const [story,setStory]=useState<number|null>(null);
  const [saved,setSaved]=useState<number[]>([]);
  useJourneyMotion(root,season);
  useEffect(()=>{
    const sections=Array.from(root.current?.querySelectorAll<HTMLElement>('[data-chapter]')||[]);
    let frame=0;
    const update=()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(()=>{let index=0;sections.forEach((section,i)=>{if(section.getBoundingClientRect().top<window.innerHeight*.48)index=i;});setActive(index);});};
    window.addEventListener('scroll',update,{passive:true});update();
    return()=>{window.removeEventListener('scroll',update);cancelAnimationFrame(frame);};
  },[]);
  const selected=content.rooms[room];
  const cards:[PhotoId,string,string][]=[
    ['alpine-fireside','09:12','La sveglia può aspettare.'],
    [season==='summer'?'summer-trail':'winter-trail','14:36',season==='summer'?'Prendiamo il sentiero lungo.':'Lasciamo le prime impronte.'],
    ['alpine-social','18:42','Ancora cinque minuti.'],
  ];
  return <div className="alpine-journey" ref={root}>
    <nav className="chapter-rail" aria-label="Capitoli della vacanza">{chapters.map(([id,label],i)=><a key={id} href={`#${id}`} className={active===i?'is-current':''} aria-label={`${i+1}. ${label}`} aria-current={active===i?'step':undefined}><span className="rail-dot"/><span className="rail-label">{label}</span></a>)}</nav>
    <section id="arrivo" data-chapter className="arrival-chapter" aria-labelledby="arrival-title">
      <div className="arrival-stage"><div className="journey-season"><SeasonSwitch compact/></div>
        <div className="arrival-landscape"><Landscape priority/></div><div className="arrival-shade"/>
        <div className="arrival-title"><p className="chapter-kicker">MEMENTO · ALPINE DAYS, SLOW NIGHTS</p><h1 id="arrival-title">Quassù,<br/><em>si sta bene.</em></h1><p className="arrival-description">Aria buona. Persone care.<br/>Il resto può aspettare.</p><button className="journey-link light" onClick={()=>onBook()}>La tua prossima pausa <Arrow/></button></div>
        <span className="arrival-note">{season==='summer'?'Pelle al sole, piedi nell’erba.':'Guance fredde, mani calde.'}</span>
        <div className="arrival-bottom"><span>DOLOMITI / {season==='summer'?'ESTATE':'INVERNO'}</span><a href="#il-luogo">Lasciati portare <Arrow down/></a><span>01 — ARRIVARE</span></div>
        <div className="arrival-whisper" aria-hidden="true"><span>Un respiro.</span><em>Sei già altrove.</em></div>
      </div>
    </section>
    <section id="il-luogo" data-chapter className="chalet-chapter" aria-labelledby="chalet-title">
      <div className="chalet-stage">
        <div className="chalet-photo"><Photo id="alpine-fireside" cover/><div className="chalet-shade"/></div>
        <div className="chalet-intro"><span className="chapter-kicker">02 / IL PIACERE DI RALLENTARE</span><h2 id="chalet-title">Meno programmi.<br/><em>Più montagna.</em></h2></div>
        <div className="chalet-caption"><p>Una coperta. Due tazze.<br/>Il fuoco che scoppietta.</p><span>Ci sono posti che non chiedono niente.<br/>Solo di esserci.</span><Link href="/galleria" className="journey-link light">Entra nell’atmosfera <Arrow/></Link></div>
        <span className="scene-note">Modalità: non disturbare.</span>
      </div>
    </section>
    <section id="rifugi" data-chapter className="refuge-chapter journey-section" aria-labelledby="refuge-title">
      <div className="refuge-heading" data-reveal><p className="chapter-kicker">03 / UN POSTO TUTTO TUO</p><h2 id="refuge-title">Qui puoi<br/><em>restare.</em></h2><p>Un nido per due. Uno chalet nel verde.<br/>Una casa da riempire di ricordi.</p></div>
      <div className="refuge-image" key={selected.id}><Photo id={roomPhoto[selected.id]}/><span className="photo-index">0{room+1} / 03</span><button className="round-control" onClick={()=>setRoom((room+1)%3)} aria-label="Rifugio successivo"><Arrow/></button></div>
      <div className="refuge-choice"><div className="refuge-tabs" role="group" aria-label="Scegli il tuo rifugio">{content.rooms.map((r,i)=><button key={r.id} onClick={()=>setRoom(i)} aria-pressed={room===i}>{roomTypes[i]}</button>)}</div><div className="refuge-description" aria-live="polite"><h3>{selected.name}</h3><p>{roomLines[room]}</p></div><div className="refuge-actions"><button className="journey-link" onClick={()=>onBook({roomId:selected.id})}>Lo sento già mio <Arrow/></button><Link href={`/suite/${selected.id}`} className="quiet-link">Esplora gli spazi</Link></div></div>
    </section>
    <section id="benessere" data-chapter className="slow-chapter" aria-labelledby="slow-title">
      <div className="slow-stage"><div className="slow-photo slow-photo-first"><Photo id="spa-care" cover/></div><div className="slow-photo slow-photo-second"><Photo id="alpine-slow" cover/></div><div className="slow-shade"/>
        <div className="slow-copy"><p className="chapter-kicker">04 / LASCIARSI ANDARE</p><h2 id="slow-title">Caldo dentro.<br/><em>Montagna fuori.</em></h2><p className="slow-description">L’acqua ti avvolge.<br/>I pensieri prendono il largo.</p><Link href="/spa" className="journey-link light">Il tuo momento di benessere <Arrow/></Link></div>
        <div className="slow-ritual" aria-label="Il ritmo del benessere"><span>Immergiti.</span><span>Respira.</span><span>Ricomincia.</span></div><span className="scene-note">Niente da fare. Tutto da sentire.</span>
      </div>
    </section>
    <section id="giornate" data-chapter className="days-chapter journey-section" aria-labelledby="days-title">
      <div className="days-heading" data-reveal><p className="chapter-kicker">05 / LE GIORNATE MIGLIORI</p><h2 id="days-title">Succede quando<br/><em>non hai fretta.</em></h2><p>{season==='summer'?'Prendi il sentiero lungo. Fermati dove ti va. Torna quando cambia la luce.':'Segui le impronte. Lasciati sorprendere dalla neve. Torna con le guance rosse.'}</p><Link href="/esperienze" className="journey-link">Trova la tua avventura <Arrow/></Link></div>
      <div className="postcards">{cards.map(([photo,time,title],i)=><article className={`postcard postcard-${i}`} key={i}><button className="postcard-open" onClick={()=>setStory(i)} aria-label={`Apri il momento: ${title}`}><Photo id={photo}/><span className="postcard-time">{time} / MEMENTO</span><span className="postcard-title">{title}</span><span className="postcard-open-hint">VIVI IL MOMENTO <Arrow/></span></button><button className={`save-moment ${saved.includes(i)?'saved':''}`} aria-label={`${saved.includes(i)?'Rimuovi':'Salva'} il momento ${i+1}`} aria-pressed={saved.includes(i)} onClick={()=>setSaved(s=>s.includes(i)?s.filter(n=>n!==i):[...s,i])}><Icon name={saved.includes(i)?'check':'bookmark'}/></button></article>)}</div>
      <p className="postcard-footnote" aria-live="polite">{saved.length?`${saved.length} ${saved.length===1?'momento da portare':'momenti da portare'} con te.`:'Piccoli momenti. Grandi ricordi.'} <Link href="/galleria">Sfoglia la galleria <Arrow/></Link></p>
    </section>
    <section id="a-tavola" data-chapter className="together-chapter" aria-labelledby="together-title"><div className="together-photo"><Photo id="alpine-social" cover/></div><div className="together-shade"/><div className="together-copy" data-reveal><p className="chapter-kicker">06 / IL BELLO È RITROVARSI</p><h2 id="together-title">L’ultimo calice.<br/><em>Forse.</em></h2><p>La luce sulle cime. Qualcosa di buono da dividere.<br/>Quelle conversazioni che fanno tardi.</p><Link href="/ristoranti" className="journey-link light">Ti teniamo un posto a tavola <Arrow/></Link></div><span className="scene-note">Il panorama è meglio in compagnia.</span></section>
    <section id="il-tuo-memento" data-chapter className="departure-chapter journey-section" aria-labelledby="departure-title"><div className="departure-photo"><Photo id={draft.roomId?roomPhoto[draft.roomId]:'suite-bosco'}/></div><div className="departure-copy" data-reveal><p className="chapter-kicker">07 / ORA TOCCA A TE</p><h2 id="departure-title">Facciamolo<br/><em>succedere.</em></h2><p>Prima scegli come vuoi sentirti.<br/>Al resto diamo forma insieme.</p><button className="journey-button" onClick={()=>onBook()}>Disegna la tua pausa <Arrow/></button><span className="booking-small-note">Tre piccoli passi. Un soggiorno tutto tuo.</span><Link href="/contatti" className="quiet-link">Preferisci lasciarti consigliare?</Link></div></section>
    <Dialog open={story!==null} onClose={()=>setStory(null)} labelledBy="moment-title" className="story-dialog moment-dialog"><article className="story-content"><div className="dialog-top"><span className="small-label">MEMENTO / PICCOLE COSE DA RICORDARE</span><button className="close-button" onClick={()=>setStory(null)} data-autofocus aria-label="Chiudi il momento"><Icon name="close"/></button></div>{story!==null&&<><Photo id={cards[story][0]}/><div className="story-text"><p className="chapter-kicker">{cards[story][1]} · IL TUO TEMPO</p><h2 id="moment-title">{cards[story][2]}</h2><p className="story-intro">{story===0?'C’è una felicità semplice nel non dover essere da nessun’altra parte.':story===1?'Le giornate più belle non stanno tutte in un programma.':'La montagna fa da sfondo. Le persone fanno il resto.'}</p>{momentParagraphs[story].map(p=><p key={p}>{p}</p>)}<button className="journey-link" onClick={()=>{setStory(null);onBook({interest:story===0?'spa':story===1?(season==='summer'?'sentieri':'neve'):'ristoranti'});}}>Voglio un momento così <Arrow/></button></div></>}</article></Dialog>
  </div>;
}
