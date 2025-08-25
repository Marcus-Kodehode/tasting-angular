import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [FormsModule, NgFor],
  templateUrl: './todo.html',
  styleUrl: './todo.css',
})
export class Todo {
  newTask = '';
  tasks: string[] = [];

  addTask() {
    const t = this.newTask.trim();
    if (t) {
      this.tasks.unshift(t);
      this.newTask = '';
    }
  }

  removeTask(i: number) {
    this.tasks.splice(i, 1);
  }
}
