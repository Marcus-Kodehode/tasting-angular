// Fil: src/app/todo/todo.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf, NgStyle, NgClass, SlicePipe, AsyncPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TodoStore, Task } from './todo.store';
import { SUPPORTED_LANGUAGES, Lang } from '../i18n';

/** Filtre i UI */
type Filter = 'all' | 'active' | 'done';

/** Språk-uavhengige nøkler vi lagrer for select-feltene */
type CatKey = 'WORK' | 'HOME' | 'SCHOOL' | 'TRAINING' | 'HEALTH';
type PrioKey = 'LOW' | 'MEDIUM' | 'HIGH';
type RepeatKey = 'DAILY' | 'WEEKLY' | 'BIWEEKLY';

/** Input-feltet for kategori må også kunne være tomt eller 'custom' */
type NewCategory = '' | CatKey | 'custom';

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
  imports: [FormsModule, NgIf, NgForOf, NgStyle, NgClass, SlicePipe, AsyncPipe, TranslateModule],
})
export class Todo {
  // ---------------------------
  // 🟩 Inputfelter (skjema)
  // ---------------------------
  newTask = '';
  newDueDate = '';
  newDueTime = '';
  newEndTime = '';
  newCategory: NewCategory = '';
  customCategory = '';
  newNote = '';
  newPriority: '' | PrioKey = '';
  newColor = '';
  newRepeat: '' | RepeatKey = '';
  newLink = '';
  newStartDate = '';
  newProject = '';

  /** Verdier som NØKLER (språk-uavhengig) */
  categories: CatKey[] = ['WORK', 'HOME', 'SCHOOL', 'TRAINING', 'HEALTH'];
  priorities: PrioKey[] = ['LOW', 'MEDIUM', 'HIGH'];
  repeats: RepeatKey[] = ['DAILY', 'WEEKLY', 'BIWEEKLY'];

  // ---------------------------
  // 🟩 App-state
  // ---------------------------
  tasks: Task[] = [];
  filter: Filter = 'all';
  sortBy: string = 'date';

  showForm = true;
  showAllActive = false;
  showAllCompleted = false;

  // ---------------------------
  // 🟩 Språk
  // ---------------------------
  supportedLanguages = SUPPORTED_LANGUAGES;
  lang: Lang = 'nb';

  constructor(private store: TodoStore, private translate: TranslateService) {
    this.tasks = this.store.get();

    // Språk: lagret > currentLang > nb
    const saved =
      (localStorage.getItem('lang') as Lang) || (this.translate.currentLang as Lang) || 'nb';
    this.translate.setDefaultLang('nb');
    this.translate.use(saved);
    this.lang = saved;
  }

  changeLang(code: Lang): void {
    this.lang = code;
    this.translate.use(code);
    localStorage.setItem('lang', code);
  }

  // ---------------------------
  // 🟩 Handlinger
  // ---------------------------
  addTask(): void {
    const t = this.newTask.trim();
    if (!t) return;

    // lagre nøkkel (CatKey) hvis valgt, ellers fritekst fra custom
    let category = '';
    if (this.newCategory === 'custom' || this.newCategory === '') {
      category = this.customCategory.trim() || '';
    } else {
      category = this.newCategory; // WORK/HOME/...
    }

    const task: Task = {
      id: Date.now(),
      text: t,
      done: false,
      startDate: this.newStartDate,
      dueDate: this.newDueDate,
      dueTime: this.newDueTime,
      endTime: this.newEndTime,
      category,
      note: this.newNote,
      priority: this.newPriority || '',
      repeat: this.newRepeat || '',
      link: this.newLink,
      color: this.newColor,
      project: this.newProject,
    };

    this.tasks.unshift(task);
    this.resetFields();
    this.persist();
  }

  toggle(task: Task): void {
    task.done = !task.done;
    this.persist();
  }

  remove(task: Task): void {
    this.tasks = this.tasks.filter((t) => t.id !== task.id);
    this.persist();
  }

  /** Fjern KUN fullførte oppgaver */
  clearCompleted(): void {
    this.tasks = this.tasks.filter((t) => !t.done);
    this.persist();
  }

  // ---------------------------
  // 🟩 Visningslogikk
  // ---------------------------
  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  toggleShowAll(type: 'active' | 'completed'): void {
    if (type === 'active') this.showAllActive = !this.showAllActive;
    else this.showAllCompleted = !this.showAllCompleted;
  }

  get anyDone(): boolean {
    return this.tasks.some((t) => t.done);
  }

  get visible(): Task[] {
    const list = [...this.tasks];
    if (this.sortBy === 'date') {
      list.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    } else if (this.sortBy === 'name') {
      list.sort((a, b) => a.text.localeCompare(b.text));
    } else if (this.sortBy === 'category') {
      // sorter på visningsetikett, ikke råverdi
      list.sort((a, b) => (this.catLabel(a) || '').localeCompare(this.catLabel(b) || ''));
    }
    return list;
  }

  get activeTasks(): Task[] {
    return this.visible.filter((t) => !t.done);
  }
  get completedTasks(): Task[] {
    return this.visible.filter((t) => t.done);
  }

  trackById(_index: number, t: Task): number {
    return t.id;
  }

  /** CSS-klasse for farget venstrekant basert på prioritet (støtter både nøkler og gamle fritekster) */
  priorityClass(t: Task): string {
    const raw = (t.priority || '').toString().toLowerCase();
    if (raw === 'high' || raw.includes('høy') || raw.includes('hoy')) return 'prio-high';
    if (raw === 'medium' || raw.includes('middels') || raw.includes('mid')) return 'prio-mid';
    if (raw === 'low' || raw.includes('lav')) return 'prio-low';
    return 'prio-low';
  }

  /** Label for kategori – bruker i18n-nøkkel hvis det er en CatKey, ellers lagret fritekst */
  catLabel(t: Task): string {
    const v = (t.category || '').toString();
    const key = 'TODO.CAT_' + v.toUpperCase(); // f.eks. TODO.CAT_WORK
    const tr = this.translate.instant(key);
    return tr && !tr.startsWith('TODO.CAT_') ? tr : v; // fallback til original tekst
  }

  /** Label for prioritet – bruker i18n-nøkkel hvis mulig, ellers lagret fritekst */
  prioLabel(t: Task): string {
    const v = (t.priority || '').toString();
    const key = 'TODO.PRIO_' + v.toUpperCase(); // f.eks. TODO.PRIO_HIGH
    const tr = this.translate.instant(key);
    return tr && !tr.startsWith('TODO.PRIO_') ? tr : v;
  }

  // ---------------------------
  // 🟩 Persistens
  // ---------------------------
  private persist(): void {
    this.store.set(this.tasks);
  }

  private resetFields(): void {
    this.newTask =
      this.newStartDate =
      this.newDueDate =
      this.newDueTime =
      this.newEndTime =
      this.customCategory =
      this.newNote =
      this.newLink =
      this.newColor =
      this.newProject =
        '';
    this.newCategory = ''; // (NewCategory)
    this.newPriority = ''; // ('' | PrioKey)
    this.newRepeat = ''; // ('' | RepeatKey)
  }
}
