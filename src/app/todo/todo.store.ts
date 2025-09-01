// Fil: src/app/todo/todo.store.ts
// ---------------------------------
// Enkel "store"/tjeneste for å persistere Todo-oppgaver i localStorage.

import { Injectable } from '@angular/core';

/**
 * Domeneobjekt for én oppgave i Todo-appen.
 */
export interface Task {
  id: number;             // Unik ID
  text: string;           // Oppgavetekst
  done: boolean;          // Ferdigstilt eller ikke

  startDate?: string;     // Startdato (valgfritt)
  dueDate?: string;       // Forfallsdato (valgfritt)
  dueTime?: string;       // Starttid (valgfritt)
  endTime?: string;       // Sluttid (valgfritt)

  category?: string;      // Kategori
  note?: string;          // Notat eller beskrivelse
  priority?: string;      // Lav / Middels / Høy
  repeat?: string;        // Gjentakelse (f.eks. ukentlig)
  link?: string;          // URL til fil, side, vedlegg
  color?: string;         // Fargekode (hex)
  project?: string;       // Prosjektnavn
  selected?: boolean;     // Multiselect-bruk i UI
}

/**
 * Nøkkel brukt i localStorage
 */
const KEY = 'todo:v2';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  /**
   * Leser hele todo-lista fra localStorage.
   */
  get(): Task[] {
    try {
      const raw = localStorage.getItem(KEY) || '[]';
      return JSON.parse(raw) as Task[];
    } catch {
      return [];
    }
  }

  /**
   * Skriver hele todo-lista til localStorage.
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
