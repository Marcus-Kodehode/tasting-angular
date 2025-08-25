import { Component } from '@angular/core';
import { Todo } from './todo/todo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Todo],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  name = 'Marcus';
}
