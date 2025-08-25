import { Component } from '@angular/core';
import { Todo } from './todo/todo';  // <- IKKE .component, og navnet er 'Todo'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Todo], // <- bruk komponenten her
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  name = 'Marcus';
}
