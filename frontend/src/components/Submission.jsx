import React from 'react';
import { CheckCircle2, XCircle, Clock, Cpu } from 'lucide-react';

const Submission = ({ submission }) => {
  const memoryArr = JSON.parse(submission.memory || '[]');
  const timeArr = JSON.parse(submission.time || '[]');

  const avgMemory = memoryArr.length
    ? memoryArr.map(m => parseFloat(m)).reduce((a, b) => a + b, 0) / memoryArr.length
    : 0;

  const avgTime = timeArr.length
    ? timeArr.map(t => parseFloat(t)).reduce((a, b) => a + b, 0) / timeArr.length
    : 0;

  const passedTests = submission.testCases.filter(tc => tc.passed).length;
  const totalTests = submission.testCases.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Status</h3>
            <div className={`text-lg font-bold ${submission.status === 'Accepted' ? 'text-success' : 'text-error'}`}>
              {submission.status}
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm">Test Cases</h3>
            <div className="text-lg font-bold">
              {passedTests}/{totalTests}
              <span className="text-sm text-base-content/50 ml-1">({successRate.toFixed(0)}%)</span>
            </div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-1">
              <Clock className="w-3 h-3" /> Avg. Runtime
            </h3>
            <div className="text-lg font-bold">{avgTime.toFixed(3)} s</div>
          </div>
        </div>
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <h3 className="card-title text-sm flex items-center gap-1">
              <Cpu className="w-3 h-3" /> Avg. Memory
            </h3>
            <div className="text-lg font-bold">{avgMemory.toFixed(0)} KB</div>
          </div>
        </div>
      </div>

      {/* Per-test-case results */}
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title mb-4">Test Cases Results</h2>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Status</th>
                  <th>Expected Output</th>
                  <th>Your Output</th>
                  <th>Memory</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {submission.testCases.map((testCase) => (
                  <tr key={testCase.id}>
                    <td className="font-mono text-sm text-base-content/50">#{testCase.testCase}</td>
                    <td>
                      {testCase.passed ? (
                        <div className="flex items-center gap-2 text-success font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Passed
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-error font-semibold">
                          <XCircle className="w-4 h-4" /> Failed
                        </div>
                      )}
                    </td>
                    <td className="font-mono text-sm">{testCase.expected}</td>
                    <td className="font-mono text-sm">{testCase.stdout || <span className="text-base-content/30">null</span>}</td>
                    <td className="text-sm">{testCase.memory || '—'}</td>
                    <td className="text-sm">{testCase.time || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Submission;
