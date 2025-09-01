// Fil: src/app/todo/todo.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf, NgStyle, NgClass } from '@angular/common';
import { TodoStore, Task } from './todo.store';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, NgStyle, NgClass],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  // --- Inputfelt ---
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

  // --- Lister for valgbare felter ---
  categories = ['Jobb', 'Hjem', 'Skole', 'Trening', 'Helse'];
  priorities = ['Lav', 'Middels', 'Høy'];
  repeats = ['Daglig', 'Ukentlig', 'Annenhver uke'];

  tasks: Task[] = [];
  filter: Filter = 'all';
  sortBy: string = 'date';

  constructor(private store: TodoStore) {
    this.tasks = this.store.get();
  }

  addTask(): void {
    const t = this.newTask.trim();
    if (!t) return;

    const category = this.newCategory === 'custom' ? this.customCategory.trim() : this.newCategory;

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

    // Reset alle inputfelt
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

  markAllDone(): void {
    // Sett alle som IKKE er ferdige til ferdig
    this.tasks.forEach((t) => {
      if (!t.done) t.done = true;
    });

    // Fjern alle som allerede var ferdige
    this.tasks = this.tasks.filter((t) => !t.done || t.selected);

    this.persist();
  }

  setFilter(f: Filter): void {
    this.filter = f;
  }

  get anyDone(): boolean {
    return this.tasks.some((t) => t.done);
  }

  get visible(): Task[] {
    let list = [...this.tasks];
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

  private persist(): void {
    this.store.set(this.tasks);
  }
}
