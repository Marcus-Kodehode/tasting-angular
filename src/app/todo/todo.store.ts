import { Injectable } from '@angular/core';

export interface Task { id: number; text: string; done: boolean; }
const KEY = 'todo:v1';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  get(): Task[] {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  }
  set(tasks: Task[]) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }
}
