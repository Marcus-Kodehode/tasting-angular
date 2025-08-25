// Fil: src/app/app.ts
// ---------------------------------------------------------
// Root-komponenten for appen. Viser enten et "Hva heter du?"-skjermbilde
// eller selve todo-appen, avhengig av om `name` finnes.
// Lagrer/leser brukernavn i localStorage.

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // for [(ngModel)]
import { NgIf } from '@angular/common';       // for *ngIf i templaten
import { Todo } from './todo/todo';           // standalone todo-komponenten din

@Component({
  selector: 'app-root',                 // brukes i index.html som <app-root></app-root>
  standalone: true,                     // moderne Angular uten NgModule
  imports: [Todo, FormsModule, NgIf],   // hva denne komponenten trenger i templaten
  templateUrl: './app.html',            // markup (se kommentert versjon tidligere)
  styleUrl: './app.css',                // scoped CSS for akkurat denne komponenten
})
export class App {
  // --- State ---
  name = '';       // faktisk navn som trigger "innlogget" visning
  tempName = '';   // mellomlager for input-feltet før vi lagrer

  // Lifecycle-hook: kjøres når komponenten initialiseres.
  // NB: å "implements OnInit" er valgfritt; Angular kaller metoden på navn uansett.
  ngOnInit() {
    // Les evt. lagret navn fra localStorage (nettleserlagring).
    // Hvis noe finnes, setter vi `name` slik at greeting/todo vises med en gang.
    const stored = localStorage.getItem('user:name');
    if (stored) this.name = stored;
  }

  // Kalles når brukeren trykker "Fortsett".
  saveName() {
    const trimmed = this.tempName.trim(); // fjern whitespace i begge ender
    if (!trimmed) return;                 // ignorér tom innsendelse
    this.name = trimmed;                  // sett "innlogget" navn
    localStorage.setItem('user:name', this.name); // persistér for reload
    // (valgfritt): this.tempName = ''; // rydde feltet etter lagring
  }
}
