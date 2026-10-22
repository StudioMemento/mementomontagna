# MEMENTO · Mountain Hospitality — demo V03

Pacchetto della demo pubblicata su Sites, adattato per Vercel. Contiene sorgenti, fotografie, font, animazioni e configurazione di build. Il sito è in italiano e comprende home, suite, benessere, ristorazione, esperienze, galleria e contatti.

## Pubblicare su Vercel

1. Estrai lo ZIP in una cartella.
2. Carica il contenuto in un repository GitHub, GitLab o Bitbucket. `package.json` e `vercel.json` devono trovarsi nella radice del progetto.
3. In Vercel crea un nuovo progetto e importa il repository.
4. Mantieni le impostazioni indicate sotto e avvia il deploy.

| Impostazione | Valore |
| --- | --- |
| Framework | Vite |
| Root Directory | Cartella che contiene `package.json` |
| Node.js | 24.x |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Variabili da configurare | Nessuna |

`vercel.json` imposta già installazione, build, output e riscritture per le pagine interne. Il lockfile mantiene le versioni delle dipendenze.

In alternativa puoi pubblicare dalla cartella estratta con la CLI:

```sh
npx vercel
```

Segui la procedura guidata per collegare il tuo account e il progetto. Per pubblicare una versione in produzione, esegui successivamente `npx vercel --prod`.

## Avvio in locale

Installa Node.js 24 e poi esegui nella cartella del progetto:

```sh
npm ci
npm run dev
```

Apri l'indirizzo mostrato nel terminale. Per controllare la versione di produzione:

```sh
npm run build
npm run preview
```

Il comando `npm test` esegue i test presenti. `npm run build` comprende il controllo TypeScript.

## Personalizzazione

- Testi e catalogo: `src/data/`.
- Home e pagine: `src/pages/`.
- Stili: `src/styles/`.
- Immagini, marchio e font: `public/assets/`.
- Configurazione delle animazioni: `src/data/motion-config.json`.
- Metadati e titolo: `index.html`.

Le immagini e i font sono inclusi. Su Vercel l'immagine di condivisione viene collegata automaticamente al dominio del deploy durante la build.

## Comportamento della demo

Il percorso di booking è una simulazione interattiva: permette di scegliere atmosfera, alloggio, date e servizi e scaricare un riepilogo. Non verifica disponibilità reali, non invia richieste e non effettua prenotazioni o pagamenti. Per usarlo in una struttura reale occorre collegare il booking engine scelto.

La demo mantiene `noindex, nofollow` e `robots.txt` con indicizzazione disabilitata. Per trasformarla in un sito pubblico indicizzabile, modifica il meta robots in `index.html` e il contenuto di `robots.txt` generato da `scripts/postbuild.mjs`.

## Verifica del pacchetto

Installazione pulita con `npm ci`, build di produzione e 14 test completati con esito positivo. Verificate le pagine interne generate e l’immagine social sul dominio del deploy.

## Provenienza

- Versione demo: V03.
- Revisione sorgente: `2e52ac560cd020d94744dc566c0fb2b8b8c6f24f`.
- Esportazione: 22 ottobre 2026.
- Adattamenti dell'esportazione: configurazione Vercel, Node.js 24, rimozione del dominio di sviluppo e immagine social collegata al nuovo deploy.

Lo ZIP contiene il progetto sorgente; le cartelle `node_modules` e `dist` vengono generate con i comandi sopra.

Documentazione ufficiale: [Vite su Vercel](https://vercel.com/docs/frameworks/frontend/vite), [versioni Node.js](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).
