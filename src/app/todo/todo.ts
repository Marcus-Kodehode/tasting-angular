import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TodoStore, Task } from './todo.store';

type Filter = 'all' | 'active' | 'done';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, NgFor, NgIf],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  newTask = '';
  newDueDate = '';
  newDueTime = '';
  newCategory = '';
  customCategory = '';

  categories = ['Jobb', 'Hjem', 'Skole', 'Trening', 'Helse'];

  tasks: Task[] = [];
  filter: Filter = 'all';
  selectMode = false;

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
    });

    this.newTask = '';
    this.newDueDate = '';
    this.newDueTime = '';
    this.newCategory = '';
    this.persist();
    this.customCategory = '';
  }

  toggle(task: Task): void {
    task.done = !task.done;
    this.persist();
  }

  toggleSelectAll(): void {
    const value = this.anySelected ? false : true;
    this.visible.forEach((t) => (t.selected = value));
  }

  markSelectedAsDone(): void {
    this.tasks.forEach((t) => {
      if (t.selected) t.done = true;
    });
    this.persist();
  }

  markSelectedAsUndone(): void {
    this.tasks.forEach((t) => {
      if (t.selected) t.done = false;
    });
    this.persist();
  }

  removeSelected(): void {
    this.tasks = this.tasks.filter((t) => !t.selected);
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
    if (this.filter === 'active') return this.tasks.filter((t) => !t.done);
    if (this.filter === 'done') return this.tasks.filter((t) => t.done);
    return this.tasks;
  }

  get activeTasks(): Task[] {
    return this.tasks.filter((t) => !t.done);
  }

  get completedTasks(): Task[] {
    return this.tasks.filter((t) => t.done);
  }

  trackById(index: number, t: Task): number {
    return t.id;
  }

  private persist(): void {
    this.store.set(this.tasks);
  }
}
