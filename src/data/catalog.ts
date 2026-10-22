import content from './content.it.json';
export { content };
export type Season = 'summer' | 'winter';
export const isSeason = (value: unknown): value is Season => value === 'summer' || value === 'winter';
export const seasonLabel = (season: Season) => season === 'summer' ? 'Estate' : 'Inverno';
export const photos = {
  'alpine-fireside': {file:'alpine-fireside',alt:'Una pausa insieme nello chalet, tra coperte, tè e il calore del camino.'},
  'alpine-social': {file:'alpine-social',alt:'Amici sulla terrazza dello chalet al tramonto, con un aperitivo da condividere.'},
  'alpine-slow': {file:'alpine-slow',alt:'Due persone si rilassano nella piscina calda all’aperto, davanti alle cime dolomitiche.'},
  'arrival-summer': { file: 'hero-summer', alt: 'Il lodge MEMENTO ai piedi della cresta dolomitica, in estate.' },
  'arrival-winter': { file: 'hero-winter', alt: 'Il lodge MEMENTO immerso nel paesaggio innevato.' },
  'suite-bosco': { file: 'suite-bosco', alt: 'Chalet Bosco: lino, larice e una grande finestra aperta sul bosco.' },
  'suite-winter': { file: 'suite-dolomiti', alt: 'Suite Dolomiti: il salotto e la seduta affacciata sulle cime innevate.' },
  'suite-panorama': { file: 'suite-panorama', alt: 'Appartamento Panorama: living luminoso e terrazza con vista sulle Dolomiti.' },
  'spa-care': { file: 'spa-pool', alt: 'La piscina MEMENTO tra pietra chiara, sauna e vetrate sulle montagne.' },
  'health-club': { file: 'health-club', alt: 'Movimento guidato nello studio MEMENTO, affacciato sul paesaggio.' },
  dining: { file: 'dining-room', alt: 'La sala del ristorante al crepuscolo, con lino, ceramiche e luce calda.' },
  libraries: { file: 'wine-library', alt: 'Il sommelier e una degustazione nella Wine Library MEMENTO.' },
  'cigar-library': { file: 'cigar-library', alt: 'La lounge raccolta della Cigar Library, tra pelle e legno scuro.' },
  'summer-trail': { file: 'summer-trail', alt: 'Un sentiero tra prati e larici sotto le pareti dolomitiche.' },
  'winter-trail': { file: 'winter-trail', alt: 'Una passeggiata nella neve tra abeti e cime delle Dolomiti.' },
  'lobby': { file: 'lobby', alt: 'Il living MEMENTO: poltrone, libri e un camino acceso.' },
  'alpine-table': { file: 'alpine-table', alt: 'Un piatto di pasta ripiena alle erbe, servito su ceramica artigianale.' },
} satisfies Record<string, { file: string; alt: string }>;
export type PhotoId = keyof typeof photos;
export const photoSrc = (id: PhotoId, width = 1536) => `/assets/photos/${photos[id].file}-${photos[id].file.startsWith('hero-') ? (width === 768 ? 768 : 1672) : width}.webp`;
export const photoSrcSet = (id: PhotoId) => [768, 1536].map(w => `${photoSrc(id, w)} ${photos[id].file.startsWith('hero-') && w === 1536 ? 1672 : w}w`).join(', ');
export const roomPhoto: Record<string, PhotoId> = { 'suite-bosco': 'suite-bosco', 'suite-dolomiti': 'suite-winter', 'suite-panorama': 'suite-panorama' };
export const serviceDetails: Record<string, { intro: string; includes: string[]; note: string; related: string[] }> = {
  spa: {
    intro: 'Il calore della pietra, la luce sull’acqua. Uno spazio raccolto dove lasciare andare la giornata e tornare ad ascoltarsi.',
    includes: ['Piscina interna e zona relax', 'Sauna e bagno di vapore', 'Docce sensoriali', 'Massaggi e rituali su richiesta'],
    note: 'Il tuo rituale, al tuo ritmo. Trattamenti e percorsi si compongono con il concierge.',
    related: ['health-club', 'ristoranti'],
  },
  'health-club': {
    intro: 'Respirare più a fondo. Muoversi con consapevolezza. Un luogo luminoso, aperto al paesaggio, per ritrovare energia con una guida dedicata.',
    includes: ['Palestra con vista sul paesaggio', 'Yoga, mobilità e respiro', 'Personal training su richiesta', 'Preparazione e recupero dal movimento'],
    note: 'Ogni sessione si adatta alle tue preferenze. Tempi e programmi sono da concordare.',
    related: ['spa', 'ristoranti'],
  },
  ristoranti: {
    intro: 'Le stagioni entrano in cucina. Sapori nitidi, materie prime e gesti misurati raccontano il paesaggio, dal primo risveglio all’ultima cena.',
    includes: ['Una proposta gastronomica', 'Una tavola più informale', 'Cucina ispirata alle stagioni', 'Abbinamenti con il sommelier, su richiesta'],
    note: 'Preferenze e necessità alimentari si definiscono con il concierge prima del soggiorno.',
    related: ['wine-library', 'cigar-library'],
  },
  'wine-library': {
    intro: 'Leggere un territorio attraverso un calice. Etichette da scoprire, storie da ascoltare e il tempo giusto per lasciarsi sorprendere.',
    includes: ['Selezione di vini da esplorare', 'Accompagnamento del sommelier', 'Degustazioni su richiesta', 'Abbinamenti con la cucina'],
    note: 'Una selezione personale, da costruire insieme. Etichette, disponibilità e proposte su richiesta.',
    related: ['ristoranti', 'cigar-library'],
  },
  'cigar-library': {
    intro: 'Poltrone raccolte, materiali caldi e conversazioni a bassa voce. Una sala dedicata, separata dagli altri ambienti, per chi sceglie una pausa diversa.',
    includes: ['Lounge dedicata e separata', 'Spazi per la lettura e la conversazione', 'Selezione su richiesta', 'Percorso riservato agli adulti'],
    note: 'L’accesso e i servizi della sala si definiscono con il concierge. Nessuna vendita online.',
    related: ['wine-library', 'ristoranti'],
  },
};
export const faqs = [
  { question: 'Come si compone il soggiorno?', answer: 'Seleziona le date, la suite e i tuoi interessi: il flusso qui mostrato è dimostrativo. Potrai rivedere tutte le scelte in un riepilogo, senza inviare una richiesta.' },
  { question: 'Quali esperienze di benessere sono previste?', answer: 'Il concept comprende piscina interna, sauna, bagno di vapore, docce sensoriali, massaggi, Health Club, yoga e personal training. Trattamenti e programmi sono su richiesta.' },
  { question: 'Posso personalizzare le attività?', answer: 'Sì. Nel percorso dimostrativo puoi indicare i tuoi interessi, scegliere esperienze stagionali e aggiungere una nota. Il concierge è il punto di riferimento previsto per un futuro soggiorno reale.' },
  { question: 'Dove si trova l’hotel?', answer: 'MEMENTO è un concept di hospitality: la struttura rappresentata è immaginaria. Le immagini interpretano un rifugio contemporaneo nelle Dolomiti e non documentano una localizzazione reale.' },
];
export const heroSrc = (season: Season, width = 1672) => `/assets/photos/hero-${season}-${width}.webp`;
export const heroSrcSet = (season: Season) => [768, 1200, 1672].map(w => `${heroSrc(season, w)} ${w}w`).join(', ');
export const allInterestOptions = [
  ...content.services.map(s => ({ id: s.id, name: s.label, season: null as Season | null })),
  ...(['summer', 'winter'] as Season[]).flatMap(season => content.experiences[season].map(e => ({ ...e, season }))),
];
