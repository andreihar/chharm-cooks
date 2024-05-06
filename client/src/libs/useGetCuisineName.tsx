import { useTranslation } from 'react-i18next';
import adjectives from '../assets/translations/adjectives.json';

interface AdjectivesType {
  [key: string]: string[];
}

export function useGetCuisineName() {
  const { i18n } = useTranslation();

  return (cuisine: string): string => {
    return (adjectives as AdjectivesType)[cuisine]
      ? i18n.language === 'zh'
        ? (adjectives as AdjectivesType)[cuisine][1]
        : i18n.language === 'ms'
          ? (adjectives as AdjectivesType)[cuisine][2]
          : (adjectives as AdjectivesType)[cuisine][0]
      : cuisine;
  };
}