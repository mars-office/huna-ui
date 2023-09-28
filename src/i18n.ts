import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import environment from "./environment";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: environment.i18n.languages.find(x => x.default === true)!.code,
    debug: false,

    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;