// Fil: src/main.ts
// ---------------------------------------------------------
// Dette er "entry point" for Angular-appen din i nettleseren.
// Her bootes rot-komponenten (App) med global konfig (appConfig),
// og globale styles lastes inn (Tailwind m.m.).

import { bootstrapApplication } from '@angular/platform-browser';
// bootstrapApplication starter en standalone Angular-app i browseren
// uten å bruke tradisjonell NgModule.

import { appConfig } from './app/app.config';
// Global konfig for appen (providers). Her har du bl.a.
// provideBrowserGlobalErrorListeners() og provideZoneChangeDetection().

import { App } from './app/app';
// Rot-komponenten som renderes inn i <app-root> i index.html.

import './styles.css';
// Globale CSS (inkl. Tailwind). Import her sikrer at byggeverktøyet
// plukker opp og prosesserer CSS før appen bootstrappes.

// Start appen: Render <App> inn i <app-root> i index.html med gitt konfig.
// Funksjonen returnerer en Promise; ev. feil fanges i .catch().
bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

/* -------------------------------------------------------
 SAMMENDRAG
 ---------------------------------------------------------
 - main.ts er inngangspunktet til Angular-appen i nettleseren.
 - Den:
     1) importerer globale styles (Tailwind via styles.css),
     2) importerer appConfig (globale providers),
     3) booter rotkomponenten App via bootstrapApplication().
 - <app-root> i src/index.html er hook-punktet der App renderes.
 - Utvidelser gjøres typisk i app.config.ts (f.eks. provideRouter, provideHttpClient).
 - Feilhåndtering: .catch logger oppstartsfeil; bytt ut console.error med
   egen ErrorHandler / ekstern logging hvis ønskelig.
 ------------------------------------------------------- */
