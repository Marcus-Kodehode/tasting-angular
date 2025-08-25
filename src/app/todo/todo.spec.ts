// Fil: src/app/todo/todo.spec.ts

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Todo } from './todo';

describe('Todo', () => {
  // component: selve TypeScript-instansen av komponenten (klassen)
  let component: Todo;

  // fixture: "testramme" som holder både komponent-instans og rendret DOM
  //  - fixture.componentInstance  -> gir deg klassen (kalle metoder, sette felter)
  //  - fixture.nativeElement      -> gir deg DOM (querye, klikke, lese tekst)
  //  - fixture.detectChanges()    -> kjør change detection / oppdater DOM
  let fixture: ComponentFixture<Todo>;

  beforeEach(async () => {
    // TestBed setter opp et isolert Angular-miljø (som et mini-app-modul).
    // For STANDALONE-komponenter legges komponenten i "imports".
    // Hvis Todo hadde avhengigheter (FormsModule, child-components osv),
    // ville de også blitt lagt i "imports".
    await TestBed.configureTestingModule({
      imports: [Todo],
      // providers: [
      //   // Eksempel ved behov: mock av en service som injiseres i Todo
      //   { provide: TodoStore, useValue: mockStore }
      // ]
    }).compileComponents(); // kompilerer template + styles asynkront før opprettelse

    // Lager en fixture (host for komponenten) og rendrer første versjon av DOM.
    fixture = TestBed.createComponent(Todo);

    // Hent selve komponent-instansen for å kunne kalle metoder / sette felter.
    component = fixture.componentInstance;

    // Første change detection:
    //  - kjører ngOnInit/ngOnChanges (hvis aktuelt)
    //  - evaluerer bindings
    //  - oppdaterer DOM'en i fixture.nativeElement
    fixture.detectChanges();
  });

  it('should create', () => {
    // Røyktest: komponenten konstrueres og er sann/eksisterer.
    expect(component).toBeTruthy();
  });
});

/* -------------------------------------------------------
 SAMMENDRAG – hva skjer i denne testen?

 1) TestBed.configureTestingModule({ imports: [Todo] })
    - Setter opp testmiljø for Angular. For standalone-komponenter
      bruker vi "imports" (ikke declarations).
    - Her kunne du også lagt til providers for å mocke/injisere tjenester.

 2) .compileComponents()
    - Kompilerer komponentens template og CSS før vi oppretter den.
      (Trygt å kalle i async beforeEach i moderne Angular.)

 3) createComponent(Todo)
    - Lager en "fixture" som inneholder både komponenten (klassen)
      og rendret DOM.

 4) fixture.detectChanges()
    - Kjører første change detection (som om komponenten vises i appen).

 5) Testen 'should create'
    - En enkel røyk-test som verifiserer at alt lot seg opprette.

 Videre forslag til ekte tester:
  - Sett component.newTask = 'Kaffe'; kall component.addTask(); fixture.detectChanges();
    og forvent at element dukker opp i DOM (query via fixture.nativeElement).
  - Simuler klikk på checkbox i DOM og forvent at done toggles.
  - Mock TodoStore via providers for å unngå ekte localStorage i test.
------------------------------------------------------- */
