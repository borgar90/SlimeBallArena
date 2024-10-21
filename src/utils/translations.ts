export type Language = 'en' | 'no';

export const translations = {
  en: {
    // ... (previous translations)
    matchmaking: 'Matchmaking',
    selectOpponent: 'Select your opponent',
    selectYourSlimeBall: 'Select your SlimeBall',
  },
  no: {
    // ... (previous translations)
    matchmaking: 'Matchmaking',
    selectOpponent: 'Velg din motstander',
    selectYourSlimeBall: 'Velg din SlimeBall',
  },
};

export const useTranslation = (lang: Language) => {
  return (key: keyof typeof translations.en) => {
    return translations[lang][key] || key;
  };
};