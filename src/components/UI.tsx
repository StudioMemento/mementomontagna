import { useState, type ReactNode } from 'react';
import { ArrowRight, CalendarBlank, Users, Sun, Snowflake, X, List, Plus, Check, CaretDown, Pause, Play, BookmarkSimple, Minus, Mountains, Heart, Compass } from '@phosphor-icons/react';
import { photos, photoSrc, photoSrcSet, type PhotoId } from '../data/catalog';
export function Arrow({ down = false, back = false }: { down?: boolean; back?: boolean }) {
  return <ArrowRight className={`arrow ${down ? 'arrow-down' : ''} ${back ? 'arrow-back' : ''}`} size={22} weight="light" aria-hidden="true" />;
}
const icons = { calendar: CalendarBlank, guests: Users, sun: Sun, snow: Snowflake, close: X, menu: List, plus: Plus, check: Check, down: CaretDown, pause: Pause, play: Play, bookmark: BookmarkSimple, minus: Minus, mountain: Mountains, heart: Heart, compass: Compass };
export function Icon({ name }: { name: keyof typeof icons }) { const Component = icons[name]; return <Component size={22} weight="light" aria-hidden="true" />; }
export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) { return <p className={`eyebrow ${light ? 'eyebrow-light' : ''}`}>{children}</p>; }
export function Photo({ id, className = '', caption, priority = false, cover = false }: { id: PhotoId; className?: string; caption?: string; priority?: boolean; cover?: boolean }) {
  const [failed, setFailed] = useState(false);
  return <figure className={`photo ${className}`}><div className="photo-surface">{!failed ? <img key={id} src={photoSrc(id)} srcSet={photoSrcSet(id)} sizes={priority || cover ? "(max-width: 1023px) 150vh, 100vw" : "(max-width: 767px) 100vw, 70vw"} width="1536" height="1024" alt={photos[id].alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} onError={() => setFailed(true)} /> : <p className="photo-fallback">{photos[id].alt}</p>}</div>{caption && <figcaption>{caption}</figcaption>}</figure>;
}
