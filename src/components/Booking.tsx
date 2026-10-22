import { useEffect, useRef, useState, type FormEvent, type Dispatch, type SetStateAction } from 'react';
import { allInterestOptions, content, roomPhoto, seasonLabel, type PhotoId } from '../data/catalog';
import { useSeason } from '../hooks/useSeason';
import { formatDate, todayRome, validateBooking, type BookingDraft } from '../lib/booking';
import { Dialog } from './Dialog';
import { Arrow, Icon, Photo } from './UI';
type Props={open:boolean;onClose:()=>void;draft:BookingDraft;setDraft:Dispatch<SetStateAction<BookingDraft>>};
const moods=[
  {id:'slow',title:'Piano, pianissimo.',tag:'RELAX & BENESSERE',line:'Acqua calda, una coperta e nessuna sveglia.',photo:'alpine-slow' as PhotoId,icon:'heart' as const},
  {id:'explore',title:'Con il naso all’insù.',tag:'NATURA & AVVENTURA',line:'Aria aperta, nuovi sentieri e guance felici.',photo:'summer-trail' as PhotoId,icon:'compass' as const},
  {id:'together',title:'In buona compagnia.',tag:'SAPORI & PICCOLE COSE',line:'Un tavolo lungo. Un’altra storia da raccontare.',photo:'alpine-social' as PhotoId,icon:'guests' as const},
];
const roomKinds=['Chalet','Suite','Appartamento'];
export function Booking({open,onClose,draft,setDraft}:Props){
  const {season}=useSeason();
  const [step,setStep]=useState(0);const [furthest,setFurthest]=useState(0);const [errors,setErrors]=useState<Record<string,string>>({});
  const panel=useRef<HTMLElement>(null);const form=useRef<HTMLFormElement>(null);
  const inferredMood=draft.interests.includes('ristoranti')?'together':draft.interests.some(i=>i==='sentieri'||i==='neve')?'explore':'slow';
  const mood=moods.find(m=>m.id===(draft.mood||inferredMood))||moods[0];
  const room=content.rooms.find(r=>r.id===draft.roomId);
  const nights=draft.arrival&&draft.departure?Math.round((Date.parse(draft.departure)-Date.parse(draft.arrival))/86400000):0;
  useEffect(()=>{if(open){setStep(0);setFurthest(0);setErrors({});}},[open]);
  const update=<K extends keyof BookingDraft>(key:K,value:BookingDraft[K])=>{setDraft(current=>({...current,[key]:value}));setErrors(current=>({...current,[key]:''}));};
  const go=(next:number)=>{setStep(next);setFurthest(n=>Math.max(n,next));requestAnimationFrame(()=>{if(panel.current)panel.current.scrollTop=0;document.getElementById('planner-step-title')?.focus({preventScroll:true});});};
  const chooseMood=(id:string)=>{
    const target=id==='slow'?'spa':id==='explore'?(season==='summer'?'sentieri':'neve'):'ristoranti';
    setDraft(current=>({...current,mood:id,interests:[...current.interests.filter(i=>!['spa','sentieri','neve','ristoranti'].includes(i)),target]}));
  };
  const submit=(event:FormEvent<HTMLFormElement>)=>{
    event.preventDefault();const fields=new FormData(event.currentTarget);
    const submitted={...draft,arrival:String(fields.get('arrival')||''),departure:String(fields.get('departure')||''),notes:String(fields.get('notes')||'')};
    const next=validateBooking(submitted,season);setDraft(submitted);setErrors(next);
    if(Object.keys(next).length){requestAnimationFrame(()=>form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());return;}
    go(3);
  };
  const savePlan=()=>{
    const interests=allInterestOptions.filter(i=>draft.interests.includes(i.id)).map(i=>i.name).join(', ');
    const text=`MEMENTO — IL TUO SOGGIORNO\n\n${mood.title}\n${formatDate(draft.arrival)} — ${formatDate(draft.departure)}\n${nights} notti · ${draft.adults} adulti\n${room?.name||'Rifugio da scegliere insieme'}\n${seasonLabel(season)}\n\nI tuoi momenti: ${interests||'Da decidere, senza fretta'}\n${draft.notes?`\nUn desiderio: ${draft.notes}\n`:''}\nConcept dimostrativo. Nessuna prenotazione o richiesta è stata effettuata. Prezzi e disponibilità da definire.\n`;
    const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='Il-mio-Memento.txt';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  const sidePhoto=step===0?(mood.id==='explore'&&season==='winter'?'winter-trail':mood.photo):room?roomPhoto[room.id]:mood.photo;
  return <Dialog open={open} onClose={onClose} labelledBy="booking-title" className="planner-dialog">
    <div className="planner-shell">
      <aside className="planner-scene"><Photo id={sidePhoto} cover/><div className="planner-scene-shade"/><span className="planner-scene-label">MEMENTO / {seasonLabel(season)}</span><div className="planner-scene-copy"><span>IL TUO PROSSIMO RICORDO</span><p>{step===3?'Ci sei già, con la testa.':mood.id==='slow'?'Il tempo può aspettare.':mood.id==='explore'?'Il bello è là fuori.':'Le cose belle si condividono.'}</p><div>{room?.name||'Il tuo angolo di montagna'}<br/>{draft.adults} ospiti{nights>0?` · ${nights} notti`:''}</div></div></aside>
      <section className="planner-panel" ref={panel}>
        <div className="planner-top"><span className="chapter-kicker">UNA PAUSA TUTTA TUA</span><button className="close-button" onClick={onClose} aria-label="Chiudi il soggiorno" data-autofocus><Icon name="close"/></button></div>
        <h2 id="booking-title" className="sr-only">Il tuo soggiorno.</h2>
        {step<3&&<nav className="planner-progress" aria-label="Passi del soggiorno">{['Il ritmo','Il rifugio','Le date'].map((label,i)=><button key={label} aria-current={step===i?'step':undefined} disabled={i>furthest} onClick={()=>go(i)}><span>{step>i?<Icon name="check"/>:`0${i+1}`}</span>{label}</button>)}</nav>}
        <div className="planner-stage" key={step}>
          {step===0&&<><p className="planner-step-label">01 / COMINCIAMO DA UNA SENSAZIONE</p><h3 id="planner-step-title" tabIndex={-1}>Di cosa hai<br/><em>voglia?</em></h3><p className="planner-intro">Non serve avere già un programma.<br/>Scegli il ritmo che ti somiglia.</p><div className="mood-options" role="group" aria-label="Il ritmo della tua vacanza">{moods.map(m=><button key={m.id} className={mood.id===m.id?'selected':''} onClick={()=>chooseMood(m.id)} aria-pressed={mood.id===m.id}><Photo id={m.id==='explore'&&season==='winter'?'winter-trail':m.photo}/><span><small>{m.tag}</small><strong>{m.title}</strong><span>{m.line}</span></span><span className="mood-check"><Icon name={mood.id===m.id?'check':m.icon}/></span></button>)}</div><div className="planner-actions"><span>Segui l’istinto.<br/>Puoi cambiare idea.</span><button className="journey-button" onClick={()=>{if(!draft.mood)chooseMood(mood.id);go(1);}}>Trova il tuo rifugio <Arrow/></button></div></>}
          {step===1&&<><p className="planner-step-label">02 / IL POSTO DOVE TORNARE</p><h3 id="planner-step-title" tabIndex={-1}>Come vuoi<br/><em>abitare la montagna?</em></h3><p className="planner-intro">Intimo, panoramico o tutto da condividere.<br/>Ascolta quello che ti fa sentire a casa.</p><div className="planner-rooms" role="group" aria-label="Il tuo rifugio">{content.rooms.map((r,i)=><button key={r.id} onClick={()=>update('roomId',r.id)} aria-pressed={draft.roomId===r.id} className={draft.roomId===r.id?'selected':''}><Photo id={roomPhoto[r.id]}/><span><small>{roomKinds[i]}</small><strong>{r.name}</strong><span>{r.description}</span></span><span className="room-check"><Icon name={draft.roomId===r.id?'check':'plus'}/></span></button>)}</div><button className="quiet-link planner-surprise" onClick={()=>{update('roomId','');go(2);}}>Mi lascio consigliare</button><div className="planner-actions"><button className="planner-back" onClick={()=>go(0)}><Arrow back/> Il ritmo</button><button className="journey-button" onClick={()=>go(2)}>Scegli le date <Arrow/></button></div></>}
          {step===2&&<><p className="planner-step-label">03 / TENIAMOCI DEL TEMPO</p><h3 id="planner-step-title" tabIndex={-1}>Quando<br/><em>stacchiamo?</em></h3><p className="planner-intro">Le date, le persone, un desiderio in più.<br/>La tua pausa prende forma.</p><form ref={form} onSubmit={submit} noValidate>
            <div className="planner-dates">{(['arrival','departure'] as const).map((key,i)=><label className="field" key={key}><span>{i===0?'Arrivo':'Partenza'} <span aria-hidden="true">*</span></span><input id={`booking-${key}`} name={key} type="date" defaultValue={draft[key]} min={i===0?todayRome():draft.arrival||todayRome()} onChange={e=>update(key,e.target.value)} onInput={e=>update(key,e.currentTarget.value)} required aria-invalid={!!errors[key]} aria-describedby={errors[key]?`planner-error-${key}`:undefined}/>{errors[key]&&<span className="field-error" id={`planner-error-${key}`}>{errors[key]}</span>}</label>)}</div>
            <div className="planner-guests"><span><small>IN BUONA COMPAGNIA</small><strong>{draft.adults} {draft.adults===1?'ospite':'ospiti'}</strong></span><div><button type="button" aria-label="Un ospite in meno" disabled={draft.adults<=1} onClick={()=>update('adults',draft.adults-1)}><Icon name="minus"/></button><output aria-label="Numero ospiti">{draft.adults}</output><button type="button" aria-label="Un ospite in più" disabled={draft.adults>=6} onClick={()=>update('adults',draft.adults+1)}><Icon name="plus"/></button></div></div>
            {nights>0&&<p className="nights-note" role="status">{nights} {nights===1?'notte':'notti'} lontano dalla solita routine.</p>}
            <details className="planner-details" open={!!errors.interests}><summary>Un piccolo desiderio in più <Icon name="plus"/></summary><fieldset><legend>I tuoi momenti</legend><div className="planner-interests">{allInterestOptions.filter(i=>!i.season||i.season===season||draft.interests.includes(i.id)).map(i=><label key={i.id}><input type="checkbox" checked={draft.interests.includes(i.id)} aria-invalid={!!errors.interests} onChange={()=>update('interests',draft.interests.includes(i.id)?draft.interests.filter(v=>v!==i.id):[...draft.interests,i.id])}/><span>{i.name}{i.season&&i.season!==season?' · altra stagione':''}</span></label>)}</div>{errors.interests&&<p className="field-error" role="alert">{errors.interests}</p>}</fieldset><label className="field"><span>Un desiderio in più <small>facoltativo</small></span><textarea name="notes" maxLength={1000} rows={2} defaultValue={draft.notes} onChange={e=>update('notes',e.target.value)} placeholder="Un’occasione speciale, il ritmo che cerchi… Non inserire dati personali."/></label></details>
            <div className="planner-actions"><button className="planner-back" type="button" onClick={()=>go(1)}><Arrow back/> Il rifugio</button><button className="journey-button" type="submit">Visualizza riepilogo <Arrow/></button></div><p className="planner-demo">{content.booking.notice}</p>
          </form></>}
          {step===3&&<div className="planner-summary"><span className="summary-mark"><Icon name="check"/></span><p className="planner-step-label">ECCO IL TUO MEMENTO</p><h3 id="planner-step-title" tabIndex={-1}>Si parte.<br/><em>Con la fantasia.</em></h3><p className="planner-intro">Hai appena dato forma alla tua prossima pausa.</p><div className="stay-ticket"><div className="ticket-heading"><span>MEMENTO</span><small>{seasonLabel(season)} · {nights} {nights===1?'notte':'notti'}</small></div><h4>{room?.name||'Il rifugio da scegliere insieme'}</h4><div className="ticket-dates"><span><small>ARRIVO</small>{formatDate(draft.arrival)}</span><Arrow/><span><small>PARTENZA</small>{formatDate(draft.departure)}</span></div><div className="ticket-bottom"><span>{draft.adults} adulti</span><span>{mood.title}</span></div><p>{allInterestOptions.filter(i=>draft.interests.includes(i.id)).map(i=>i.name).join(' · ')||'Tutto lo spazio per improvvisare.'}</p>{draft.notes&&<p>{draft.notes}</p>}</div><p className="planner-demo" role="status">{content.booking.success}</p><button className="journey-button" onClick={savePlan}>Salva il tuo Memento <Icon name="bookmark"/></button><div className="summary-links"><button className="quiet-link" onClick={()=>go(2)}>Modifica le tue scelte</button><button className="quiet-link" onClick={onClose}>Torna alla montagna</button></div></div>}
        </div>
      </section>
    </div>
  </Dialog>;
}
