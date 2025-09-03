import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf, NgStyle, NgClass, SlicePipe, AsyncPipe } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TodoStore, Task } from './todo.store';
import { SUPPORTED_LANGUAGES, Lang } from '../i18n';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
  imports: [FormsModule, NgIf, NgForOf, NgStyle, SlicePipe, TranslateModule],
})
export class Todo {
  // ----------------------------------------
  // 🟩 Inputfelter for ny oppgave
  // ----------------------------------------
  newTask = '';
  newDueDate = '';
  newDueTime = '';
  newEndTime = '';
  newCategory = '';
  customCategory = '';
  newNote = '';
  newPriority = '';
  newColor = '';
  newRepeat = '';
  newLink = '';
  newStartDate = '';
  newProject = '';

  categories = ['Jobb', 'Hjem', 'Skole', 'Trening', 'Helse'];
  priorities = ['Lav', 'Middels', 'Høy'];
  repeats = ['Daglig', 'Ukentlig', 'Annenhver uke'];

  // ----------------------------------------
  // 🟩 Applikasjonsstatus
  // ----------------------------------------
  tasks: Task[] = [];
  filter: Filter = 'all';
  sortBy: string = 'date';

  showForm = true;
  showAllActive = false;
  showAllCompleted = false;

  // ----------------------------------------
  // 🟩 Språk og oversettelse
  // ----------------------------------------
  supportedLanguages = SUPPORTED_LANGUAGES; // typed via 'as const'
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

  // ----------------------------------------
  // 🟩 Oppgavehandlinger
  // ----------------------------------------
  addTask(): void {
    const t = this.newTask.trim();
    if (!t) return;

    const category =
      this.newCategory === 'custom' ? this.customCategory.trim() : this.newCategory || '';

    this.tasks.unshift({
      id: Date.now(),
      text: t,
      done: false,
      startDate: this.newStartDate,
      dueDate: this.newDueDate,
      dueTime: this.newDueTime,
      endTime: this.newEndTime,
      category,
      note: this.newNote,
      priority: this.newPriority,
      repeat: this.newRepeat,
      link: this.newLink,
      color: this.newColor,
      project: this.newProject,
    });

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

  // ----------------------------------------
  // 🟩 UI og visningslogikk
  // ----------------------------------------
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
      list.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    }
    return list;
  }

  get activeTasks(): Task[] {
    return this.visible.filter((t) => !t.done);
  }

  get completedTasks(): Task[] {
    return this.visible.filter((t) => t.done);
  }

  trackById(index: number, t: Task): number {
    return t.id;
  }

  // ----------------------------------------
  // 🟩 Persistens og tilbakestilling
  // ----------------------------------------
  private persist(): void {
    this.store.set(this.tasks);
  }

  private resetFields(): void {
    this.newTask =
      this.newStartDate =
      this.newDueDate =
      this.newDueTime =
      this.newEndTime =
      this.newCategory =
      this.customCategory =
      this.newNote =
      this.newPriority =
      this.newRepeat =
      this.newLink =
      this.newColor =
      this.newProject =
        '';
  }
}
