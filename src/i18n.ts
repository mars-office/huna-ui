import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import environment from './environment';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    detection: {
      convertDetectedLanguage: (lng) => {
        lng = lng.replace("-", "_");
        if (lng.indexOf('_') === -1) {
          return lng;
        }
        return lng.substring(0, lng.indexOf("_"));
      }
    },
    fallbackLng: environment.i18n.languages.find((x) => x.default === true)!.code,
    debug: false,
    supportedLngs: environment.i18n.languages.map(x => x.code),
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
