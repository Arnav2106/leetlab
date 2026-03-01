import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  FileText,
  MessageSquare,
  Lightbulb,
  Bookmark,
  Share2,
  Clock,
  ChevronRight,
  Terminal,
  Code2,
  Users,
  ThumbsUp,
  Home,
  Star,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useProblemStore } from "../store/useProblemStore";
import { getLanguageId } from "../lib/lang";
import { useExecutionStore } from "../store/useExecutionStore";
import { useSubmissionStore } from "../store/useSubmissionStore";
import Submission from "../components/Submission";
import SubmissionsList from "../components/SubmissionList";
import CodeRater from "../components/CodeRater";

const ProblemPage = () => {
  const { id } = useParams();
  const { getProblemById, problem, isProblemLoading } = useProblemStore();

  const {
    submissions,
    isLoading: isSubmissionsLoading,
    getSubmissionForProblem,
    getSubmissionCountForProblem,
    submissionCount,
  } = useSubmissionStore();

  const [code, setCode] = useState("");
  const [activeTab, setActiveTab] = useState("description");
  const [selectedLanguage, setSelectedLanguage] = useState("JAVASCRIPT");
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [testcases, setTestCases] = useState([]);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showRater, setShowRater] = useState(false);

  const { executeCode, submission, isExecuting } = useExecutionStore();

  useEffect(() => {
    getProblemById(id);
    getSubmissionCountForProblem(id);
  }, [id]);

  useEffect(() => {
    const timerInterval = setInterval(() => {
      setElapsedTime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timerInterval);
  }, []);

  useEffect(() => {
    if (problem) {
      setCode(problem.codeSnippets?.[selectedLanguage] || "");
      setTestCases(
        problem.testcases?.map((tc) => ({ input: tc.input, output: tc.output })) || []
      );
    }
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (activeTab === "submissions" && id) {
      getSubmissionForProblem(id);
    }
  }, [activeTab, id]);

  const handleLanguageChange = (e) => {
    const lang = e.target.value;
    setSelectedLanguage(lang);
    setCode(problem.codeSnippets?.[lang] || "");
  };

  const handleRunCode = (e) => {
    e.preventDefault();
    try {
      const language_id = getLanguageId(selectedLanguage);
      const stdin = problem.testcases.map((tc) => tc.input);
      const expected_outputs = problem.testcases.map((tc) => tc.output);
      executeCode(code, language_id, stdin, expected_outputs, id, elapsedTime);
    } catch (error) {
      console.log("Error executing code", error);
    }
  };

  const handleSubmitSolution = (e) => {
    e.preventDefault();
    handleRunCode(e); // Trigger same run execution
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (isProblemLoading || !problem) {
    return (
      <div className="flex items-center justify-center h-screen bg-base-200">
        <div className="card bg-base-100 p-8 shadow-xl">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="mt-4 text-base-content/70">Loading problem...</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight text-white mb-4">{problem.title}</h2>

            <div className="flex items-center gap-3 mb-6">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${problem.difficulty === 'EASY' ? 'bg-green-500/10 text-green-500' :
                problem.difficulty === 'MEDIUM' ? 'bg-yellow-500/10 text-yellow-500' :
                  'bg-red-500/10 text-red-500'
                }`}>
                {problem.difficulty}
              </span>
              <button className="text-gray-400 hover:text-white transition-colors">
                <ThumbsUp className="w-4 h-4" />
              </button>
            </div>

            <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed">
              <div className="text-base whitespace-pre-wrap">{problem.description}</div>

              {problem.examples && (
                <div className="mt-8 space-y-6">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2">Examples</h3>
                  {Object.entries(problem.examples).map(([lang, example], index) => (
                    <div key={index} className="space-y-3">
                      <div className="text-sm font-semibold text-gray-400">Example {index + 1}:</div>
                      <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/5 font-mono text-sm">
                        <div className="mb-2">
                          <span className="text-primary font-bold">Input: </span>
                          <span className="text-gray-300">{example.input}</span>
                        </div>
                        <div className="mb-2">
                          <span className="text-primary font-bold">Output: </span>
                          <span className="text-gray-300">{example.output}</span>
                        </div>
                        {example.explanation && (
                          <div>
                            <span className="text-primary font-bold">Explanation: </span>
                            <p className="text-gray-400 inline">{example.explanation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints && (
                <div className="mt-8">
                  <h3 className="text-lg font-bold text-white border-b border-white/5 pb-2 mb-4">Constraints</h3>
                  <div className="bg-[#1e1e1e] p-4 rounded-xl border border-white/5">
                    <ul className="list-disc list-inside space-y-2 text-sm text-gray-400">
                      <li>{problem.constraints}</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      case "submissions":
        return <SubmissionsList submissions={submissions} isLoading={isSubmissionsLoading} />;
      case "discussion":
        return <div className="p-4 text-center text-base-content/70">No discussions yet</div>;
      case "hints":
        return (
          <div className="p-4">
            {problem?.hints ? (
              <div className="bg-base-200 p-6 rounded-xl">
                <span className="bg-black/90 px-4 py-1 rounded-lg font-semibold text-white text-lg">
                  {problem.hints}
                </span>
              </div>
            ) : (
              <div className="text-center text-base-content/70">No hints available</div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-gray-200 flex flex-col w-full">
      {/* Navbar */}
      <nav className="flex items-center justify-between px-4 py-2 bg-[#282828] border-b border-white/5 shadow-md z-10">
        <div className="flex items-center gap-4 text-xs">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
          </Link>
          <div className="h-4 w-[1px] bg-white/10"></div>
          <h1 className="text-sm font-medium truncate max-w-[200px]">{problem.title}</h1>
          <div className="flex items-center gap-4 text-gray-400 ml-4">
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(elapsedTime)}
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{submissionCount} Submissions</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            className="select select-sm select-ghost bg-[#333] border-none text-xs h-8 min-h-0 focus:ring-1 focus:ring-primary/50"
            value={selectedLanguage}
            onChange={handleLanguageChange}
          >
            {Object.keys(problem.codeSnippets || {}).map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase()}
              </option>
            ))}
          </select>
          <button
            className={`p-1.5 rounded-md hover:bg-white/5 transition-colors ${isBookmarked ? "text-yellow-500" : "text-gray-400"}`}
            onClick={() => setIsBookmarked(!isBookmarked)}
          >
            <Bookmark className="w-4 h-4 fill-current" />
          </button>
          <button className="p-1.5 rounded-md hover:bg-white/5 text-gray-400 transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden p-2 gap-2">
        {/* Left Pane: Description */}
        <div className="w-1/2 flex flex-col bg-[#282828] rounded-xl overflow-hidden border border-white/5">
          <div className="flex items-center bg-[#333] px-2 border-b border-white/5 overflow-x-auto scrollbar-none">
            {[
              { key: "description", icon: <FileText className="w-3.5 h-3.5" />, label: "Description" },
              { key: "submissions", icon: <Code2 className="w-3.5 h-3.5" />, label: "Submissions" },
              { key: "discussion", icon: <MessageSquare className="w-3.5 h-3.5" />, label: "Discussion" },
              { key: "hints", icon: <Lightbulb className="w-3.5 h-3.5" />, label: "Hints" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-medium transition-all relative whitespace-nowrap ${activeTab === key ? "text-white" : "text-gray-400 hover:text-gray-200"
                  }`}
                onClick={() => setActiveTab(key)}
              >
                {icon}
                {label}
                {activeTab === key && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
                )}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-700">
            {renderTabContent()}
          </div>
        </div>

        {/* Right Pane: Editor and Console */}
        <div className="w-1/2 flex flex-col gap-2">
          {/* Top: Editor */}
          <div className="flex-[3] flex flex-col bg-[#282828] rounded-xl overflow-hidden border border-white/5">
            <div className="flex items-center justify-between bg-[#333] px-3 py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Code className="w-3.5 h-3.5 text-primary" />
                Code
              </div>
            </div>
            <div className="flex-1 relative">
              <Editor
                height="100%"
                language={selectedLanguage.toLowerCase()}
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: "on",
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  padding: { top: 16 },
                  backgroundColor: "#282828",
                }}
              />
            </div>
          </div>

          {/* Bottom: Console / Results */}
          <div className="flex-[2] flex flex-col bg-[#282828] rounded-xl overflow-hidden border border-white/5">
            <div className="flex items-center justify-between bg-[#333] px-3 py-1.5 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                <Terminal className="w-3.5 h-3.5 text-primary" />
                Console
              </div>
              <div className="flex items-center gap-2">
                <button
                  className={`btn btn-xs btn-primary h-7 min-h-0 px-3 capitalize font-semibold shadow-lg shadow-primary/20 ${isExecuting ? "loading" : ""}`}
                  onClick={handleRunCode}
                  disabled={isExecuting}
                >
                  {!isExecuting && <Play className="w-3 h-3 mr-1" />}
                  Run
                </button>
                <button
                  className={`btn btn-xs btn-success h-7 min-h-0 px-3 capitalize font-semibold shadow-lg shadow-success/20 ${isExecuting ? "loading" : ""}`}
                  onClick={handleSubmitSolution}
                  disabled={isExecuting}
                >
                  Submit
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-[#1e1e1e]/50 scrollbar-thin scrollbar-thumb-gray-700">
              {submission ? (
                <Submission submission={submission} />
              ) : (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-gray-400 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    Test Cases
                  </h3>
                  <div className="space-y-3">
                    {testcases.map((testCase, index) => (
                      <div key={index} className="bg-[#333] p-3 rounded-lg border border-white/5">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Input</div>
                            <div className="font-mono text-sm text-gray-300">{testCase.input}</div>
                          </div>
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Expected</div>
                            <div className="font-mono text-sm text-gray-300">{testCase.output}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Rater Modal */}
      {showRater && (
        <CodeRater
          submissionId={submission?.id}
          onClose={() => setShowRater(false)}
        />
      )}

      {/* Absolute floating Rate My Code button if we have a submission */}
      {submission?.id && !showRater && (
        <button
          className="fixed bottom-6 right-6 btn btn-warning btn-sm rounded-full shadow-2xl animate-bounce-subtle"
          onClick={() => setShowRater(true)}
        >
          <Star className="w-4 h-4 mr-2" />
          Rate My Code
        </button>
      )}
    </div>
  );
};

export default ProblemPage;
