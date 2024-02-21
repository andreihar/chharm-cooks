import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { en }  from '../assets/translations/en.ts';
import { cn }  from '../assets/translations/cn.ts';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en,
      cn
    },
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
