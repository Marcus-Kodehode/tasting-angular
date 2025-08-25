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
  tasks: Task[] = [];
  filter: Filter = 'all';

  constructor(private store: TodoStore) {
    // last fra localStorage etter at store er injisert
    this.tasks = this.store.get();
  }

  addTask(): void {
    const t = this.newTask.trim();
    if (!t) return;
    this.tasks.unshift({ id: Date.now(), text: t, done: false });
    this.newTask = '';
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

  // avledet data
  get visible(): Task[] {
    if (this.filter === 'active') return this.tasks.filter(t => !t.done);
    if (this.filter === 'done')   return this.tasks.filter(t =>  t.done);
    return this.tasks;
  }

  get remaining(): number {
    return this.tasks.filter(t => !t.done).length;
  }

  get anyDone(): boolean {
    return this.tasks.some(t => t.done);
  }

  trackById(index: number, t: Task): number {
    return t.id;
  }

  private persist(): void {
    this.store.set(this.tasks);
  }
}
