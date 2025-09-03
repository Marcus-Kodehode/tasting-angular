// Fil: src/app/app.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf, NgForOf } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { Todo } from './todo/todo';
import { EasterEgg } from './easter-egg/easter-egg';
import { SUPPORTED_LANGUAGES, Lang } from './i18n';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, TranslateModule, Todo, EasterEgg], // ⬅️ NgForOf lagt til
  templateUrl: './app.html',
  styleUrls: ['./app.css'], // ⬅️ flertall
})
export class App {
  name = '';
  tempName = '';

  supportedLanguages = SUPPORTED_LANGUAGES;
  lang: Lang = 'nb';

  constructor(private t: TranslateService) {
    const stored = localStorage.getItem('user:name');
    if (stored) this.name = stored;

    const saved = (localStorage.getItem('lang') as Lang) || (this.t.currentLang as Lang) || 'nb';
    this.t.setDefaultLang('nb');
    this.t.addLangs(this.supportedLanguages.map((l) => l.code));
    this.t.use(saved);
    this.lang = saved;
  }

  saveName() {
    const trimmed = this.tempName.trim();
    if (!trimmed) return;
    this.name = trimmed;
    localStorage.setItem('user:name', this.name);
  }

  changeLang(code: Lang) {
    this.lang = code;
    this.t.use(code);
    localStorage.setItem('lang', code);
  }

  get isEasterEgg(): boolean {
    return this.name.trim().toLowerCase() === 'joakim';
  }
  get hasName(): boolean {
    return !!this.name;
  }
}
