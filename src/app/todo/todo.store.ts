import { Injectable } from '@angular/core';

export interface Task {
  id: number;
  text: string;
  done: boolean;
  dueDate?: string;      // ISO-format (f.eks. "2025-08-26")
  dueTime?: string;      // Valgfritt tidspunkt
  category?: string;     // F.eks. "Hjemme", "Skole"
  selected?: boolean;    // For multiselect
}

const KEY = 'todo:v1';

@Injectable({ providedIn: 'root' })
export class TodoStore {
  get(): Task[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    } catch {
      return [];
    }
  }

  set(tasks: Task[]) {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }
}
