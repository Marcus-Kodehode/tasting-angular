import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { TodoStore, Task } from './todo.store';

type Filter = 'all' | 'active' | 'done';
type SortBy = 'date' | 'text' | 'category';

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
  sortBy: SortBy = 'date';
  selectMode = false;

  constructor(private store: TodoStore) {
    this.tasks = this.store.get();
  }

  addTask(): void {
    const t = this.newTask.trim();
    if (!t) return;
    const category = this.newCategory === 'custom'
      ? this.customCategory.trim()
      : this.newCategory;

    this.tasks.unshift({
      id: Date.now(),
      text: t,
      done: false,
      dueDate: this.newDueDate,
      dueTime: this.newDueTime,
      category,
    });

    this.newTask = this.newDueDate = this.newDueTime = this.newCategory = this.customCategory = '';
    this.persist();
  }

  toggle(task: Task): void {
    task.done = !task.done;
    this.persist();
  }

  remove(task: Task): void {
    this.tasks = this.tasks.filter(x => x.id !== task.id);
    this.persist();
  }

  clearCompleted(): void {
    this.tasks = this.tasks.filter(t => !t.done);
    this.persist();
  }

  setFilter(f: Filter): void {
    this.filter = f;
  }

  // Sort tasks based on current `sortBy`
  private sortList(list: Task[]): Task[] {
    return [...list].sort((a, b) => {
      if (this.sortBy === 'date') {
        const da = a.dueDate || '';
        const db = b.dueDate || '';
        if (da < db) return -1;
        if (da > db) return 1;
        return 0;
      }
      if (this.sortBy === 'text') {
        return a.text.localeCompare(b.text);
      }
      if (this.sortBy === 'category') {
        return (a.category || '').localeCompare(b.category || '');
      }
      return 0;
    });
  }

  get visible(): Task[] {
    let list = this.filter === 'active'
      ? this.tasks.filter(t => !t.done)
      : this.filter === 'done'
        ? this.tasks.filter(t => t.done)
        : this.tasks;
    return this.sortList(list);
  }

  get activeTasks(): Task[] {
    return this.sortList(this.tasks.filter(t => !t.done));
  }

  get completedTasks(): Task[] {
    return this.sortList(this.tasks.filter(t => t.done));
  }

  trackById(index: number, t: Task): number {
    return t.id;
  }

  private persist(): void {
    this.store.set(this.tasks);
  }
}
