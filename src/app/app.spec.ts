// Fil: src/app/app.spec.ts
// ---------------------------------------------------------
// Enkelt testoppsett for root-komponenten (App).
// Bruker Angular TestBed til å kompilere og opprette komponenten som i “ordentlig” runtime,
// slik at vi kan teste at den lages og at den rendrer forventet innhold i DOM.

import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    // TestBed setter opp et mini Angular-miljø for testen.
    // For STANDALONE-komponenter legges App i "imports".
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents(); // kompilerer template + styles før vi lager komponenten
  });

  it('should create the app', () => {
    // Lager et "fixture" (testramme) for App
    const fixture = TestBed.createComponent(App);

    // Selve TS-instansen av komponenten (class)
    const app = fixture.componentInstance;

    // Røyktest: at komponenten i det hele tatt opprettes
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    // Opprett komponent og kjør første render
    const fixture = TestBed.createComponent(App);

    // trigger change detection (kjører bindings og oppdaterer DOM)
    fixture.detectChanges();

    // Få tak i host-DOM (render-resultatet)
    const compiled = fixture.nativeElement as HTMLElement;

    // Sjekk at <h1> inneholder forventet tekst.
    // Merk: denne forventningen vil KUN være sann hvis din app.html faktisk
    // rendrer en <h1> med teksten "Hello, tasting-angular" et sted.
    // Hvis du har endret overskrift (f.eks. til "Hei, {{ name }}"), vil testen feile.
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, tasting-angular');
  });
});

/* -------------------------------------------------------
 SAMMENDRAG
 ---------------------------------------------------------
 - Testen bruker TestBed for å kompilere App (standalone) og verifisere:
     1) at komponenten kan opprettes (røyktest),
     2) at det finnes en <h1> som inneholder "Hello, tasting-angular".

 - Viktig praktisk poeng:
     • Hvis du har endret app.html (f.eks. viser "Hei, {{ name }} 👋" eller et annet innhold),
       vil "should render title" feile. Da må enten forventningen oppdateres,
       eller du setter opp test state før detectChanges, f.eks.:
           const fixture = TestBed.createComponent(App);
           const app = fixture.componentInstance;
           app.name = 'tasting-angular';
           fixture.detectChanges();
           expect(...).toContain('Hei, tasting-angular');

 - Videre forbedringer (valgfritt):
     • Test også interaksjon: sett name/tempName og kall saveName(), forvent at greeting vises.
     • Hvis App importerer FormsModule/Todo, kan du også teste at <app-todo> rendrer.
 ------------------------------------------------------- */
