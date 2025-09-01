// Fil: src/app/todo/todo.store.ts
// ---------------------------------
// Enkel "store"/tjeneste for å persistere Todo-oppgaver i localStorage.
// - Brukes av komponenten(e) via Dependency Injection (DI).
// - Lagrer hele listen i én JSON-streng under nøkkelen KEY.
// - Bevisst minimal: ingen reaktivitet, kun get/set mot localStorage.

import { Injectable } from '@angular/core';

/**
 * Domeneobjekt for én oppgave i Todo-appen.
 * - `dueDate` og `dueTime` lagres som strenger av enkelhetshensyn (lett å vise/binde i template).
 * - `selected` kan brukes til multivalg (bulk-slett/markér ferdig) i UI.
 */
export interface Task {
  id: number;
  text: string;
  done: boolean;
  dueDate?: string;
  dueTime?: string;
  category?: string;
  selected?: boolean;

  // 👇 Nye felter:
  note?: string;
  priority?: string;
  color?: string;
  repeat?: string;
  link?: string;
  estimatedTime?: string;
  startDate?: string;
  project?: string;
}

/**
 * Nøkkel i localStorage.
 * Tips: behold et "versjonsnavn" i nøkkelen (f.eks. v1) slik at du kan migrere senere uten
 * å krasje gammel data (lag ny KEY = 'todo:v2' og migrer ved behov).
 */
const KEY = 'todo:v1';

/**
 * @Injectable({ providedIn: 'root' })
 * - Gjør tjenesten tilgjengelig som singleton i hele appen (Angular oppretter ett felles
 *   instans som alle komponenter deler).
 * - Du slipper å registrere den i en providers-liste manuelt.
 */
@Injectable({ providedIn: 'root' })
export class TodoStore {
  /**
   * Leser hele oppgavelisten fra localStorage.
   * - Returnerer [] dersom nøkkelen mangler eller JSON-parsing feiler.
   * - NB: localStorage finnes kun i nettleser. Hvis du senere skrur på SSR,
   *   må dette kodes defensivt (f.eks. sjekke `typeof window !== 'undefined'`).
   */
  get(): Task[] {
    try {
      // Hent rå streng; fall tilbake på tom liste '[]' dersom KEY ikke finnes.
      const raw = localStorage.getItem(KEY) || '[]';
      // Parse til array av Task. Vi stoler på at dataen har riktig form.
      // (Vil du være ekstra trygg: valider schema før return.)
      return JSON.parse(raw) as Task[];
    } catch {
      // Ved korrupt JSON eller annen feil – returner tom liste for å holde appen kjørende.
      return [];
    }
  }

  /**
   * Lagrer hele oppgavelisten tilbake til localStorage som JSON.
   * - JSON.stringify serialiserer objektene til en streng.
   * - localStorage er synkron og har begrenset lagringsplass (typisk 5–10 MB).
   */
  set(tasks: Task[]) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }
}

/* -------------------------------------------------------
 SAMMENDRAG
 ---------------------------------------------------------
 - Denne tjenesten er en minimal, global "store" for Todo-oppgaver.
 - `get()` henter en JSON-liste fra localStorage (eller [] hvis ingen/feil).
 - `set(tasks)` serialiserer og lagrer hele lista tilbake under KEY.
 - Bruk: injiser `TodoStore` i komponenter og kall `get()` ved init og `set()` etter endringer.
 - Fordeler: ekstremt enkel, null avhengigheter, funker offline.
 - Bevisste avgrensninger:
     • Ikke reaktiv (ingen RxJS/signals). Komponent må selv oppdatere UI etter `set()`.
     • Kun nettleser (localStorage). Ved SSR må du beskytte mot manglende window/localStorage.
     • Ingen datavalidering/migrering. Ved schema-endringer: bump KEY (v2) og migrer i kode.
 ------------------------------------------------------- */
