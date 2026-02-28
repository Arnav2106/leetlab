import axios from "axios";

const PISTON_API = "https://emkc.org/api/v2/piston";

// Map language IDs to Piston config
export const LANGUAGE_MAP = {
  // Classic LeetCode defaults
  63: { name: "JAVASCRIPT", piston: { language: "javascript", version: "*", aliases: ["node", "js"] } },
  71: { name: "PYTHON", piston: { language: "python", version: "*" } },
  62: { name: "JAVA", piston: { language: "java", version: "*" } },
  74: { name: "TYPESCRIPT", piston: { language: "typescript", version: "*" } },
  54: { name: "C++", piston: { language: "c++", version: "*" } },
  // Extended support
  50: { name: "C", piston: { language: "c", version: "*" } },
  51: { name: "C#", piston: { language: "csharp", version: "*" } },
  60: { name: "GO", piston: { language: "go", version: "*" } },
  73: { name: "RUST", piston: { language: "rust", version: "*" } },
  72: { name: "RUBY", piston: { language: "ruby", version: "*" } },
  68: { name: "PHP", piston: { language: "php", version: "*" } },
  83: { name: "SWIFT", piston: { language: "swift", version: "*" } },
  82: { name: "SQL", piston: { language: "sqlite3", version: "*" } },
};

export function getLanguageName(languageId) {
  return LANGUAGE_MAP[languageId]?.name || "Unknown";
}

export function getPistonLanguageId(language) {
  const map = {
    JAVASCRIPT: 63,
    PYTHON: 71,
    JAVA: 62,
    TYPESCRIPT: 74,
    "C++": 54,
    CPP: 54,
    C: 50,
    "C#": 51,
    CSHARP: 51,
    GO: 60,
    RUST: 73,
    RUBY: 72,
    PHP: 68,
    SWIFT: 83,
    SQL: 82,
  };
  return map[language.toUpperCase()];
}

// Run a single test case through Piston
const runWithPiston = async (source_code, language_id, stdin) => {
  const langConfig = LANGUAGE_MAP[language_id];
  if (!langConfig) throw new Error(`Unsupported language ID: ${language_id}`);

  const { data } = await axios.post(`${PISTON_API}/execute`, {
    language: langConfig.piston.language,
    version: langConfig.piston.version,
    files: [{ content: source_code }],
    stdin: stdin || "",
  });

  return {
    stdout: data.run?.stdout || "",
    stderr: data.run?.stderr || data.compile?.stderr || "",
    compile_output: data.compile?.stderr || null,
    status: {
      id: data.run?.code === 0 ? 3 : 11, // 3=Accepted, 11=Runtime Error
      description: data.run?.code === 0 ? "Accepted" : (data.compile?.stderr ? "Compilation Error" : "Runtime Error"),
    },
    time: data.run?.wall_time ? `${data.run.wall_time}` : null,
    memory: data.run?.memory ? `${data.run.memory}` : null,
  };
};

// submitBatch — runs all submissions in parallel via Piston
export const submitBatch = async (submissions) => {
  const results = await Promise.all(
    submissions.map((sub) =>
      runWithPiston(sub.source_code, sub.language_id, sub.stdin)
    )
  );
  // Return shape — each item has a token field
  return results.map((r, i) => ({ ...r, token: `piston-${i}` }));
};

// pollBatchResults — Piston is synchronous so results are already ready
export const pollBatchResults = async (tokens, cachedResults) => {
  // Results were already fetched in submitBatch, return them directly
  return cachedResults;
};
