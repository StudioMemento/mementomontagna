import { useEffect, useState } from 'react';
import { photos, photoSrc, photoSrcSet, type PhotoId } from '../data/catalog';
import { Dialog } from '../components/Dialog';
import { Arrow, Eyebrow, Icon, Photo } from '../components/UI';
type Filter='Tutte'|'Rifugi'|'Ambienti'|'Benessere'|'Cucina'|'Stagioni'|'Natura'|'Momenti';
const galleryItems:{id:PhotoId;category:Filter;title:string;label?:string}[]=[
{id:'alpine-fireside',category:'Momenti',title:'Vicini al fuoco'},
{id:'alpine-social',category:'Momenti',title:'Ancora cinque minuti'},
{id:'alpine-slow',category:'Momenti',title:'L’acqua e le cime'},
{id:'arrival-summer',category:'Stagioni',title:'Estate',label:'Apri il paesaggio estivo'},
{id:'suite-bosco',category:'Rifugi',title:'Chalet Bosco'},
{id:'spa-care',category:'Benessere',title:'Il respiro dell’acqua'},
{id:'dining',category:'Cucina',title:'Il gusto di essere qui'},
{id:'suite-winter',category:'Rifugi',title:'Suite Dolomiti'},
{id:'lobby',category:'Ambienti',title:'Sentirsi a casa'},
{id:'libraries',category:'Cucina',title:'Wine Library'},
{id:'summer-trail',category:'Natura',title:'Il passo dell’estate'},
{id:'suite-panorama',category:'Rifugi',title:'Appartamento Panorama'},
{id:'health-club',category:'Benessere',title:'Movimento e respiro'},
{id:'alpine-table',category:'Cucina',title:'Una stagione nel piatto'},
{id:'cigar-library',category:'Ambienti',title:'Cigar Library'},
{id:'arrival-winter',category:'Stagioni',title:'Inverno',label:'Apri il paesaggio invernale'},
{id:'winter-trail',category:'Natura',title:'La quiete della neve'},
];
export function GalleryPage(){const[filter,setFilter]=useState<Filter>('Tutte');const[slide,setSlide]=useState<number|null>(null);const[loading,setLoading]=useState(true);const[failed,setFailed]=useState(false);const visible=galleryItems.filter(i=>filter==='Tutte'||i.category===filter);const active=slide===null?null:visible[slide];useEffect(()=>{setLoading(true);setFailed(false)},[slide]);const changeSlide=(delta:number)=>setSlide(s=>s===null?0:(s+delta+visible.length)%visible.length);
return <><section className="page-intro container centered"><Eyebrow>LA GALLERIA MEMENTO</Eyebrow><h1>Frammenti da portare con sé.</h1><p>Il paesaggio, la materia, la cura dei dettagli. Entra nel nostro mondo, un’immagine alla volta.</p></section><section className="gallery-section container"><div className="gallery-filters" role="group" aria-label="Filtra la galleria">{(['Tutte','Rifugi','Ambienti','Benessere','Cucina','Stagioni','Natura','Momenti'] as Filter[]).map(f=><button key={f} onClick={()=>{setFilter(f);setSlide(null)}} className={filter===f?'selected':''} aria-pressed={filter===f}>{f}</button>)}</div><div className="gallery-grid" aria-live="polite">{visible.map((item,i)=><button className="gallery-item" key={item.id} onClick={()=>setSlide(i)} aria-label={item.label||`Apri ${item.title}`}><Photo id={item.id}/><span><span><small>{item.category}</small>{item.title}</span><Icon name="plus"/></span></button>)}</div><p className="gallery-note">Immagini create per raccontare il concept MEMENTO. Ogni fotografia si può esplorare a tutta vista.</p></section><Dialog open={slide!==null} onClose={()=>setSlide(null)} labelledBy="lightbox-title" className="lightbox-dialog"><div className="lightbox-content" onKeyDown={e=>{if(e.key==='ArrowRight')changeSlide(1);if(e.key==='ArrowLeft')changeSlide(-1)}}><div className="dialog-top"><h2 id="lightbox-title">MEMENTO · {active?.title}</h2><button className="close-button" onClick={()=>setSlide(null)} data-autofocus>Chiudi <Icon name="close"/></button></div><div className="lightbox-image">{loading&&!failed&&<span className="lightbox-status" role="status">La fotografia sta arrivando…</span>}{active&&(failed?<p role="status">La fotografia non è disponibile. Prova a passare alla prossima.</p>:<img key={active.id} src={photoSrc(active.id)} srcSet={photoSrcSet(active.id)} sizes="95vw" width="1536" height="1024" alt={photos[active.id].alt} onLoad={()=>setLoading(false)} onError={()=>{setLoading(false);setFailed(true)}}/>)}</div><div className="lightbox-controls"><button className="text-link" onClick={()=>changeSlide(-1)}><Arrow back/>Precedente</button><span>{slide===null?1:slide+1} / {visible.length}</span><button className="text-link" onClick={()=>changeSlide(1)}>Successiva <Arrow/></button></div></div></Dialog></>}
