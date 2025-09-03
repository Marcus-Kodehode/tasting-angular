import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core'; // ⬅️ legg til
import { Todo } from './todo/todo';
import { EasterEgg } from './easter-egg/easter-egg';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, TranslateModule, Todo, EasterEgg], // ⬅️ legg TranslateModule her
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  name = '';
  tempName = '';
  ngOnInit() {
    const stored = localStorage.getItem('user:name');
    if (stored) this.name = stored;
  }
  saveName() {
    const trimmed = this.tempName.trim();
    if (!trimmed) return;
    this.name = trimmed;
    localStorage.setItem('user:name', this.name);
  }
  get isEasterEgg(): boolean {
    return this.name.trim().toLowerCase() === 'joakim';
  }
  get hasName(): boolean {
    return !!this.name;
  }
}
