import { TranslateService } from '@ngx-translate/core';

export const SUPPORTED_LANGUAGES = [
  { code: 'nb', label: 'Norsk' },
  { code: 'en', label: 'English' },
  { code: 'es-MX', label: 'Español (MX)' },
  { code: 'tr', label: 'Türkçe' },
  { code: 'sw', label: 'Swahili' },
  { code: 'zh-Hant', label: '繁體中文' },
];

export function setupTranslation(translate: TranslateService) {
  translate.addLangs(SUPPORTED_LANGUAGES.map((l) => l.code));
  translate.setDefaultLang('nb');

  const browserLang = translate.getBrowserLang();
  const fallback = 'nb';

  const matched = SUPPORTED_LANGUAGES.find((l) => l.code === browserLang);
  const selectedLang: string = matched?.code || fallback;

  translate.use(selectedLang);
}
