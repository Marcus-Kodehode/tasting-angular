import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type LangCode = 'no' | 'en';

@Injectable({ providedIn: 'root' })
export class LangService {
  readonly supported: { code: LangCode; name: string }[] = [
    { code: 'no', name: 'Norsk' },
    { code: 'en', name: 'English' }
  ];

  constructor(private t: TranslateService) {
    const saved = (localStorage.getItem('lang') as LangCode) || 'no';
    t.addLangs(this.supported.map(s => s.code));
    t.setDefaultLang('no');
    this.use(saved);
  }

  use(code: LangCode) {
    this.t.use(code);
    localStorage.setItem('lang', code);
  }

  current(): LangCode {
    return (this.t.currentLang as LangCode) || 'no';
  }
}
