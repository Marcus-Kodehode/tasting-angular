// Fil: src/app/todo/todo.ts

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf, NgStyle } from '@angular/common';
import { TodoStore, Task } from './todo.store';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf, NgStyle],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  // --- Felt for ny oppgave ---
  newTask = '';
  newDueDate = '';
  newDueTime = '';
  newCategory = '';
  customCategory = '';

  // --- Nye felt ---
  newNote = '';
  newPriority = '';
  newColor = '';
  newRepeat = '';
  newLink = '';
  newEstimatedTime = '';
  newStartDate = '';
  newProject = '';

  categories = ['Jobb', 'Hjem', 'Skole', 'Trening', 'Helse'];
  priorities = ['Lav', 'Middels', 'Høy'];
  tasks: Task[] = [];
  filter: Filter = 'all';
  selectMode = false;
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
      dueDate: this.newDueDate,
      dueTime: this.newDueTime,
      category,
      note: this.newNote,
      priority: this.newPriority,
      color: this.newColor,
      repeat: this.newRepeat,
      link: this.newLink,
      estimatedTime: this.newEstimatedTime,
      startDate: this.newStartDate,
      project: this.newProject,
    });

    this.newTask =
      this.newDueDate =
      this.newDueTime =
      this.newCategory =
      this.customCategory =
      this.newNote =
      this.newPriority =
      this.newColor =
      this.newRepeat =
      this.newLink =
      this.newEstimatedTime =
      this.newStartDate =
      this.newProject =
        '';

    this.persist();
  }

  toggle(task: Task): void {
    task.done = !task.done;
    this.persist();
  }

  remove(task: Task): void {
    this.tasks = this.tasks.filter((x) => x.id !== task.id);
    this.persist();
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter((t) => !t.done);
    this.persist();
  }

  toggleSelectAll(): void {
    const value = this.anySelected ? false : true;
    this.visible.forEach((t) => (t.selected = value));
  }

  markSelectedAsDone(): void {
    this.tasks.forEach((t) => t.selected && (t.done = true));
    this.persist();
  }

  markSelectedAsUndone(): void {
    this.tasks.forEach((t) => t.selected && (t.done = false));
    this.persist();
  }

  removeSelected(): void {
    this.tasks = this.tasks.filter((t) => !t.selected);
    this.persist();
  }

  setFilter(f: Filter): void {
    this.filter = f;
  }

  get anySelected(): boolean {
    return this.visible.some((t) => t.selected);
  }

  get remaining(): number {
    return this.tasks.filter((t) => !t.done).length;
  }

  get anyDone(): boolean {
    return this.tasks.some((t) => t.done);
  }

  get visible(): Task[] {
    let sorted = [...this.tasks];
    if (this.sortBy === 'name') sorted.sort((a, b) => a.text.localeCompare(b.text));
    else if (this.sortBy === 'date')
      sorted.sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
    else if (this.sortBy === 'category')
      sorted.sort((a, b) => (a.category || '').localeCompare(b.category || ''));
    return sorted;
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
