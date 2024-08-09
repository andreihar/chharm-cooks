import { useTranslation } from 'react-i18next';
import adjectives from '../assets/translations/adjectives.json';
import countries from '../assets/translations/countries.json';

interface AdjectivesType {
  [key: string]: string[];
}

interface AuthorType {
  first_name: string;
  last_name: string;
}

interface RecipeTitleType {
  title: string;
  chin_title: string;
}

export function useLocalisationHelper() {
  const { i18n } = useTranslation();

  const getCuisineName = (cuisine: string): string => {
    return (adjectives as AdjectivesType)[cuisine]
      ? i18n.language === 'zh'
        ? (adjectives as AdjectivesType)[cuisine][1]
        : i18n.language === 'ms'
          ? (adjectives as AdjectivesType)[cuisine][2]
          : (adjectives as AdjectivesType)[cuisine][0]
      : cuisine;
  };

  const getAuthorName = (author: AuthorType): string => {
    return i18n.language === 'zh'
      ? `${author.last_name} ${author.first_name}`
      : `${author.first_name} ${author.last_name}`;
  };

  const getRecipeTitle = (recipe: RecipeTitleType): string => {
    return i18n.language === 'zh'
      ? recipe.chin_title
      : recipe.title;
  };

  const getCountryName = (countryCode: string) => {
    const langIndex = { "en": 0, "zh": 1, "ms": 2 }[i18n.language] || 0;
    return (countries as Record<string, string[]>)[countryCode][langIndex];
  };

  return { getCuisineName, getAuthorName, getRecipeTitle, getCountryName };
}