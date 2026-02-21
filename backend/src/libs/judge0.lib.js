import axios from "axios";

const PISTON_API = "https://emkc.org/api/v2/piston";

// Map language IDs to Piston config
const LANGUAGE_MAP = {
  63: { name: "JAVASCRIPT", piston: { language: "javascript", version: "18.15.0" } },
  71: { name: "PYTHON",     piston: { language: "python",     version: "3.10.0"  } },
  62: { name: "JAVA",       piston: { language: "java",       version: "15.0.2"  } },
  74: { name: "TYPESCRIPT", piston: { language: "typescript", version: "5.0.3"   } },
  54: { name: "C++",        piston: { language: "c++",        version: "10.2.0"  } },
};

export function getLanguageName(languageId) {
  return LANGUAGE_MAP[languageId]?.name || "Unknown";
}

export function getJudge0LanguageId(language) {
  const map = {
    JAVASCRIPT: 63,
    PYTHON: 71,
    JAVA: 62,
    TYPESCRIPT: 74,
    "C++": 54,
    CPP: 54,
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
  // Return in same shape as Judge0 batch — each item has a token field
  // We skip tokens since Piston gives results directly
  return results.map((r, i) => ({ ...r, token: `piston-${i}` }));
};

// pollBatchResults — Piston is synchronous so results are already ready
export const pollBatchResults = async (tokens, cachedResults) => {
  // Results were already fetched in submitBatch, return them directly
  return cachedResults;
};
