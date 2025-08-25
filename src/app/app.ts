import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; // 🔥 LEGG TIL DENNE
import { Todo } from './todo/todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Todo, FormsModule, NgIf], // 👈 Legg til NgIf her også
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  name = '';
  tempName = '';

  ngOnInit() {
    const stored = localStorage.getItem('user:name');
    if (stored) {
      this.name = stored;
    }
  }

  saveName() {
    const trimmed = this.tempName.trim();
    if (!trimmed) return;
    this.name = trimmed;
    localStorage.setItem('user:name', this.name);
  }
}
