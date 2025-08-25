// Fil: src/app/todo/todo.ts
// ---------------------------------
// Standalone Angular-komponent for todo-listen.
// Bruker template-drevne skjemaer (ngModel), enkel filtrering, multiselect,
// og persistering via TodoStore (localStorage).

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TodoStore, Task } from './todo.store';

// Union type for filterstate i UI. Sikkert og lett å bruke i switch/if.
type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-todo',                 // taggen du bruker i HTML: <app-todo>
  standalone: true,                     // ingen NgModule – moderne Angular
  imports: [FormsModule, NgFor, NgIf],  // komponentens avhengigheter (template-drevet forms + direktiver)
  templateUrl: './todo.html',           // separat template
  styleUrl: './todo.css',               // (scoped) css for denne komponenten
})
export class Todo {
  // --- Felt for "ny oppgave" (bundet med [(ngModel)] i skjemaet) ---
  newTask = '';         // selve teksten brukeren skriver
  newDueDate = '';      // ISO-dato ("YYYY-MM-DD") fra <input type="date">
  newDueTime = '';      // klokkeslett ("HH:mm") fra <input type="time">
  newCategory = '';     // valgt kategori i <select>
  customCategory = '';  // egen kategori når brukeren velger "custom"

  // --- UI-data ---
  categories = ['Jobb', 'Hjem', 'Skole', 'Trening', 'Helse']; // liste for <select>
  tasks: Task[] = [];   // alle oppgaver (lastes fra store i ctor)
  filter: Filter = 'all';    // gjeldende filter i UI
  selectMode = false;        // toggles for multiselect-modus (brukt av deg senere i UI)

  constructor(private store: TodoStore) {
    // Dependency Injection: Angular gir deg TodoStore-instansen (singleton).
    // Last eksisterende oppgaver fra localStorage når komponenten opprettes.
    this.tasks = this.store.get();
  }

  // Legger til ny oppgave basert på feltene ovenfor.
  // Kalles fra <form> via (submit)="addTask()" i templaten.
  addTask(): void {
    const t = this.newTask.trim();                 // fjern whitespace
    if (!t) return;                                // avbryt hvis tomt

    // Hvis bruker valgte "custom", bruk trimmed customCategory, ellers valgt kategori.
    const category =
      this.newCategory === 'custom' ? this.customCategory.trim() : this.newCategory;

    // Opprett ny Task og legg først i lista (unshift -> øverst).
    // id = Date.now() er greit her; kollisjon er ekstremt usannsynlig.
    this.tasks.unshift({
      id: Date.now(),
      text: t,
      done: false,
      dueDate: this.newDueDate,
      dueTime: this.newDueTime,
      category,
    });

    // Nullstill alle inputfeltene i skjemaet etter vellykket add.
    this.newTask = this.newDueDate = this.newDueTime = this.newCategory = this.customCategory = '';

    // Skriv til localStorage.
    this.persist();
  }

  // Flipper ferdig/ikke ferdig for én oppgave. Knyttet til (change) på checkbox.
  toggle(task: Task): void {
    task.done = !task.done;
    this.persist();
  }

  // Sletter én oppgave fra lista. Knyttet til "❌"-knappen.
  remove(task: Task): void {
    this.tasks = this.tasks.filter(x => x.id !== task.id);
    this.persist();
  }

  // Fjerner alle som er ferdige (bulk clear).
  clearCompleted(): void {
    this.tasks = this.tasks.filter(t => !t.done);
    this.persist();
  }

  // Multiselect: merk alle synlige (i gjeldende filter) som valgt/ikke valgt.
  toggleSelectAll(): void {
    const value = this.anySelected ? false : true;   // hvis noe allerede valgt -> fjern alt; ellers velg alt
    this.visible.forEach(t => (t.selected = value));
  }

  // Multiselect: sett valgte til ferdige.
  markSelectedAsDone(): void {
    this.tasks.forEach(t => t.selected && (t.done = true));
    this.persist();
  }

  // Multiselect: sett valgte til uferdige.
  markSelectedAsUndone(): void {
    this.tasks.forEach(t => t.selected && (t.done = false));
    this.persist();
  }

  // Multiselect: fjern alle valgte.
  removeSelected(): void {
    this.tasks = this.tasks.filter(t => !t.selected);
    this.persist();
  }

  // Endre filter i UI (all/active/done).
  setFilter(f: Filter): void {
    this.filter = f;
  }

  // --- Avledede getters (praktisk i templates) ---

  // Er minst én oppgave valgt i nåværende "visible" liste?
  get anySelected(): boolean {
    return this.visible.some(t => t.selected);
  }

  // Antall uferdige totalt (vises typisk som teller).
  get remaining(): number {
    return this.tasks.filter(t => !t.done).length;
  }

  // Finnes det minst én ferdig oppgave? (brukes for å vise "Fjern ferdige"-knapp e.l.)
  get anyDone(): boolean {
    return this.tasks.some(t => t.done);
  }

  // Filtrert liste basert på this.filter.
  // VIKTIG: Angular-templates kan ikke bruke piler/funksjoner i uttrykk (t => …),
  // derfor er denne getter-varianten riktig måte (du brukte den korrekt i templaten tidligere).
  get visible(): Task[] {
    if (this.filter === 'active') return this.tasks.filter(t => !t.done);
    if (this.filter === 'done')   return this.tasks.filter(t =>  t.done);
    return this.tasks; // all
  }

  // For “to-kolonners” visning i templaten (Aktive / Ferdige).
  get activeTasks(): Task[] { return this.tasks.filter(t => !t.done); }
  get completedTasks(): Task[] { return this.tasks.filter(t =>  t.done); }

  // trackBy-funksjon for *ngFor – gir bedre ytelse ved oppdatering (diff på id).
  // index-parameteren er her ikke brukt, men signaturen matches av Angular.
  trackById(index: number, t: Task): number {
    return t.id;
  }

  // Felles lagring etter endringer. Enkel og grei.
  private persist(): void {
    this.store.set(this.tasks);
  }
}
