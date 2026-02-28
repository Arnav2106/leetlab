// Judge0 CE API — Free public code execution (replacement for defunct Piston)
const JUDGE0_API = "https://ce.judge0.com";

// Judge0 CE Language IDs
export const LANGUAGE_MAP = {
  63: { name: "JAVASCRIPT", judge0Id: 63 },   // Node.js 12.14.0
  71: { name: "PYTHON", judge0Id: 92 },        // Python 3.11.2
  62: { name: "JAVA", judge0Id: 62 },           // Java OpenJDK 13.0.1
  74: { name: "TYPESCRIPT", judge0Id: 74 },     // TypeScript 3.7.4
  54: { name: "C++", judge0Id: 54 },            // C++ GCC 9.2.0
  50: { name: "C", judge0Id: 50 },              // C GCC 9.2.0
  51: { name: "C#", judge0Id: 51 },             // C# Mono 6.6.0
  60: { name: "GO", judge0Id: 60 },             // Go 1.13.5
  73: { name: "RUST", judge0Id: 73 },           // Rust 1.40.0
  72: { name: "RUBY", judge0Id: 72 },           // Ruby 2.7.0
  68: { name: "PHP", judge0Id: 68 },            // PHP 7.4.1
};

export function getLanguageName(languageId) {
  return LANGUAGE_MAP[languageId]?.name || "Unknown";
}

export function getLanguageId(language) {
  const map = {
    JAVASCRIPT: 63, PYTHON: 71, JAVA: 62, TYPESCRIPT: 74,
    "C++": 54, CPP: 54, C: 50, "C#": 51, CSHARP: 51,
    GO: 60, RUST: 73, RUBY: 72, PHP: 68,
  };
  return map[language.toUpperCase()];
}

export { JUDGE0_API };
