// Fil: src/app/app.config.ts
// ---------------------------------------------------------
// Global app-konfig som sendes inn til bootstrapApplication(App, appConfig)
// (se src/main.ts). Her registrerer vi "providers" som gjelder for hele appen.
//
// Kort:
// - provideBrowserGlobalErrorListeners(): kobler globale nettleser-feil til Angulars ErrorHandler
// - provideZoneChangeDetection({ eventCoalescing: true }): justerer hvordan Zone.js triggere
//   change detection for bedre ytelse i “event-stormer” (input/scroll/klikk)

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  // Tips: her kunne du også importert ErrorHandler hvis du vil lage egen global handler senere
} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Lytter på globale nettleserfeil:
    // - window 'error' (runtime errors i JS)
    // - window 'unhandledrejection' (Promises uten .catch)
    // Disse sendes videre til Angulars ErrorHandler (som logger til konsoll som standard).
    // Hvis du senere vil logge til en tjeneste (Sentry/LogRocket e.l.), kan du overstyre ErrorHandler.
    provideBrowserGlobalErrorListeners(),

    // Tuning for change detection når du bruker Zone.js (som du valgte å beholde):
    // eventCoalescing: true = flere DOM-events innenfor samme makrotask “samles”
    // til én change-detection-runde. Mindre CPU-bruk og færre reflow/paint ved
    // hyppige events (f.eks. input/scroll).
    provideZoneChangeDetection({ eventCoalescing: true }),

    // (Plass for flere globale providers senere, f.eks.:
    //  provideRouter(routes), provideHttpClient(), provideAnimations(), osv.)
  ]
};

/* -------------------------------------------------------
 SAMMENDRAG
 ---------------------------------------------------------
 - Denne fila eksporterer appConfig (ApplicationConfig) med globale providers.
 - provideBrowserGlobalErrorListeners() piper nettleserens globale feil inn i
   Angulars ErrorHandler (standard = konsoll). Du kan erstatte ErrorHandler
   for å logge sentralt:
     import { ErrorHandler } from '@angular/core';
     class GlobalHandler implements ErrorHandler {
       handleError(err: unknown) { /* send til Sentry, vis toast, etc. *-/ }
     }
     // og i providers: { provide: ErrorHandler, useClass: GlobalHandler }

 - provideZoneChangeDetection({ eventCoalescing: true }) reduserer unødvendige
   change-detection-runder under “event-stormer”, som gir jevnere UI.

 - main.ts bruker dette slik:
     import { bootstrapApplication } from '@angular/platform-browser';
     import { appConfig } from './app/app.config';
     import { App } from './app/app';
     bootstrapApplication(App, appConfig);

 - Videre utvidelse:
     • Routing:  provideRouter(routes)
     • HTTP:     provideHttpClient()
     • Animasjon:provideAnimations() eller provideNoopAnimations()
     • (Zoneless + signals kan vurderes senere; annen konfig. Tas når/om du bytter.)
 ------------------------------------------------------- */
