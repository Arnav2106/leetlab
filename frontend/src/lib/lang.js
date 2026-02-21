export function getLanguageName(languageId) {
  const LANGUAGE_NAMES = {
    63: "JavaScript",
    71: "Python",
    62: "Java",
    74: "TypeScript",
    54: "C++",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

export function getLanguageId(language) {
  const languageMap = {
    JAVASCRIPT: 63,
    PYTHON: 71,
    JAVA: 62,
    TYPESCRIPT: 74,
    "C++": 54,
    CPP: 54,
  };
  return languageMap[language.toUpperCase()];
}
