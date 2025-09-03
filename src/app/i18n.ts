import { TranslateService } from '@ngx-translate/core';

export const SUPPORTED_LANGUAGES = [
  { code: 'nb', label: 'Norsk' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'es-MX', label: 'Español' },
  { code: 'sw', label: 'Kiswahili' },
  { code: 'zh-Hant', label: '繁體中文' },
] as const;

// 👉 Lag en type direkte fra listen (så 'es-MX' m.fl. er gyldige)
export type Lang = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export function setupTranslation(translate: TranslateService) {
  translate.addLangs(SUPPORTED_LANGUAGES.map((l) => l.code));
  translate.setDefaultLang('nb');

  const browserLang = translate.getBrowserLang();
  const fallback: Lang = 'nb';
  const matched = SUPPORTED_LANGUAGES.find((l) => l.code === browserLang);
  const selectedLang: Lang = (matched?.code as Lang) || fallback;

  translate.use(selectedLang);
}
