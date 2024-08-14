import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faTwitter, faInstagram, faLinkedin, faYoutube, faPinterest, faSnapchat, faTiktok, faReddit, faTumblr } from '@fortawesome/free-brands-svg-icons';
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

  const getCountries = () => {
    return Object.entries(countries)
      .sort((a, b) => getCountryName(a[0]).localeCompare(getCountryName(b[0])))
      .map(([code]) => (
        <option key={code} value={code}>
          {getCountryName(code)}
        </option>
      ));
  };

  const getCuisines = (cuisine: string, setCuisine: (value: string) => void) => {
    const sortedOptions = Object.entries(adjectives)
      .reduce<{ topLevel: { value: string; label: string; }[], subLevel: { value: string; label: string; }[]; }>(
        (acc, [code, _]) => {
          const option = { value: code, label: code.includes('-') ? getCuisineName(code) : `<b>${getCuisineName(code)}</b>` };
          code.includes('-') ? acc.subLevel.push(option) : acc.topLevel.push(option);
          return acc;
        },
        { topLevel: [], subLevel: [] }
      );
    const finalOptions = sortedOptions.topLevel.sort((a, b) => a.label.localeCompare(b.label)).flatMap(topOption => [
      topOption,
      ...sortedOptions.subLevel.sort((a, b) => a.label.localeCompare(b.label)).filter(subOption => subOption.value.startsWith(`${topOption.value}-`))
    ]);

    return (
      <Select id="cuisine" name="cuisine" isClearable isSearchable required placeholder={getCuisineName('TW')} options={finalOptions}
        value={finalOptions.find(option => option.value === cuisine)}
        onChange={(option: { label: string; value: string; } | null) => setCuisine(option ? option.value : '')}
        formatOptionLabel={({ label }) => <span dangerouslySetInnerHTML={{ __html: label }} />}
      />
    );
  };

  const getWebsiteName = (url: string): string => {
    try {
      const domainParts = new URL(url).hostname.replace(/^www\./, '').split('.');
      const mainDomain = domainParts.length > 1 ? domainParts[domainParts.length - 2] : domainParts[0];
      return mainDomain.charAt(0).toUpperCase() + mainDomain.slice(1);
    } catch (error) {
      console.error('Invalid URL:', error);
      return 'Unknown';
    }
  };

  const getIconByWebsite = (url: string): IconProp => {
    const iconMap: Record<string, IconProp> = {
      facebook: faFacebook,
      twitter: faTwitter,
      instagram: faInstagram,
      linkedin: faLinkedin,
      youtube: faYoutube,
      pinterest: faPinterest,
      snapchat: faSnapchat,
      tiktok: faTiktok,
      reddit: faReddit,
      tumblr: faTumblr
    };
    return iconMap[getWebsiteName(url).toLowerCase()] || faLink;
  };

  return { getCuisineName, getAuthorName, getRecipeTitle, getCountryName, getCountries, getCuisines, getWebsiteName, getIconByWebsite };
}