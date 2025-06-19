import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import am from './locales/am.json';
import en from './locales/en.json';
import om from './locales/om.json';
import ti from './locales/ti.json';

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: async (cb) => {
    const savedLang = await AsyncStorage.getItem('user-language');
    cb(savedLang || 'en');
  },
  init: () => {},
  cacheUserLanguage: async (lng) => {
    await AsyncStorage.setItem('user-language', lng);
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      am: { translation: am },
      om: { translation: om },
      ti: { translation: ti },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
