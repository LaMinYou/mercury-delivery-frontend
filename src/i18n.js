import { createI18n } from "vue-i18n";
import en from './locales/en.json';
import my from './locales/my.json';
import zh from './locales/zh.json';

const savedLocale = localStorage.getItem('app_locale') || 'en';

const i18n = createI18n({
  locale: savedLocale,
  fallbackLocale: 'en',
  legacy: false, 
  messages: {
    en,
    my,
    zh
  }
});

export default i18n;
