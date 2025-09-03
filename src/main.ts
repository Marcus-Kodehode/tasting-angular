// Fil: src/main.ts
// ---------------------------------------------------------
// Dette er "entry point" for Angular-appen din i nettleseren.
// Her bootes rot-komponenten (App) med global konfig (appConfig),
// og globale styles lastes inn (Tailwind m.m.).
// Fil: src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';

import { App } from './app/app';
import { appConfig } from './app/app.config';

import { TranslateService, provideTranslateService } from '@ngx-translate/core';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';

import { SUPPORTED_LANGUAGES } from './app/i18n';
import './styles.css';

bootstrapApplication(App, {
  providers: [
    provideHttpClient(),
    // 👇 Dette matcher pakken du har installert
    provideTranslateService({
      lang: 'nb',
      fallbackLang: 'nb',
      loader: provideTranslateHttpLoader({
        // NB: ingen leading slash
        prefix: 'assets/i18n/',
        suffix: '.json',
      }),
    }),
    ...appConfig.providers,
  ],
})
  .then((ref) => {
    // Etter bootstrap: legg til språk og bruk lagret språk om finnes
    const t = ref.injector.get(TranslateService);
    const saved = (localStorage.getItem('lang') as string) || 'nb';
    t.addLangs(SUPPORTED_LANGUAGES.map((l) => l.code));
    t.use(saved);
  })
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
