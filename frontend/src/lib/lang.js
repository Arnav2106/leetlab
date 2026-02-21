function getLanguageName(languageId) {
    const LANGUAGE_NAMES = {
      74: "TypeScript",
      63: "JavaScript",
      71: "Python",
      62: "Java",
    };
    return LANGUAGE_NAMES[languageId] || "Unknown";
  }

  export { getLanguageName };

  // FIX: normalize to uppercase before lookup so "javascript" and "JAVASCRIPT" both work
  export function getLanguageId(language) {
    const languageMap = {
      "PYTHON": 71,
      "JAVASCRIPT": 63,
      "JAVA": 62,
      "TYPESCRIPT": 74,
    };
    return languageMap[language.toUpperCase()];
  }