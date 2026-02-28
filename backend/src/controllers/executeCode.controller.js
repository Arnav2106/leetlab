import { db } from "../libs/db.js";
import { getLanguageName, LANGUAGE_MAP } from "../libs/piston.lib.js";
import axios from "axios";

const PISTON_API = "https://emkc.org/api/v2/piston";

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

  const hasCompileError = !!data.compile?.stderr;
  const exitCode = data.run?.code ?? 0;

  return {
    stdout: data.run?.stdout?.trim() || "",
    stderr: data.run?.stderr || data.compile?.stderr || null,
    compile_output: data.compile?.stderr || null,
    status: hasCompileError
      ? "Compilation Error"
      : exitCode !== 0
        ? "Runtime Error"
        : "Accepted",
    time: data.run?.wall_time != null ? `${data.run.wall_time} s` : null,
    memory: data.run?.memory != null ? `${data.run.memory} KB` : null,
  };
};

export const executeCode = async (req, res) => {
  try {
    const { source_code, language_id, stdin, expected_outputs, problemId, timeSpent } = req.body;
    const userId = req.user.id;

    if (
      !Array.isArray(stdin) ||
      stdin.length === 0 ||
      !Array.isArray(expected_outputs) ||
      expected_outputs.length !== stdin.length
    ) {
      return res.status(400).json({ error: "Invalid or Missing test cases" });
    }

    // Run all test cases in parallel via Piston
    const pistonResults = await Promise.all(
      stdin.map((input) => runWithPiston(source_code, language_id, input))
    );

    let allPassed = true;
    const detailedResults = pistonResults.map((result, i) => {
      const stdout = result.stdout?.trim();
      const expected_output = expected_outputs[i]?.trim();
      const passed = stdout === expected_output && result.status === "Accepted";
      if (!passed) allPassed = false;

      return {
        testCase: i + 1,
        passed,
        stdout,
        expected: expected_output,
        stderr: result.stderr || null,
        compile_output: result.compile_output || null,
        status: result.status,
        memory: result.memory,
        time: result.time,
      };
    });

    // Save submission to DB
    const submission = await db.submission.create({
      data: {
        userId,
        problemId,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r) => r.stdout)),
        stderr: detailedResults.some((r) => r.stderr)
          ? JSON.stringify(detailedResults.map((r) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r) => r.memory)
          ? JSON.stringify(detailedResults.map((r) => r.memory))
          : null,
        time: detailedResults.some((r) => r.time)
          ? JSON.stringify(detailedResults.map((r) => r.time))
          : null,
        timeSpent: timeSpent || null,
      },
    });

    // Mark problem as solved if all passed
    if (allPassed) {
      await db.problemSolved.upsert({
        where: { userId_problemId: { userId, problemId } },
        update: {},
        create: { userId, problemId },
      });
    }

    // Save individual test case results
    await db.testCaseResult.createMany({
      data: detailedResults.map((result) => ({
        submissionId: submission.id,
        testCase: result.testCase,
        passed: result.passed,
        stdout: result.stdout,
        expected: result.expected,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        status: result.status,
        memory: result.memory,
        time: result.time,
      })),
    });

    const submissionWithTestCase = await db.submission.findUnique({
      where: { id: submission.id },
      include: { testCases: true },
    });

    res.status(200).json({
      success: true,
      message: "Code Executed Successfully!",
      submission: submissionWithTestCase,
    });
  } catch (error) {
    console.error("Error executing code:", error.message);
    res.status(500).json({ error: "Failed to execute code" });
  }
};
