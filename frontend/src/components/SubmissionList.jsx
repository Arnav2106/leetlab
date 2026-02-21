import { CheckCircle2, XCircle, Clock, Calendar, Cpu } from "lucide-react";

const safeParse = (data) => {
  try { return JSON.parse(data); } catch { return []; }
};

const calcAvg = (jsonStr, unit) => {
  const arr = safeParse(jsonStr).map(v => parseFloat(v));
  if (!arr.length) return null;
  const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
  return unit === 'time' ? avg.toFixed(3) + ' s' : avg.toFixed(0) + ' KB';
};

const SubmissionsList = ({ submissions, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!submissions?.length) {
    return (
      <div className="text-center p-8">
        <div className="text-base-content/70">No submissions yet — run your code to see results here.</div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {submissions.map((submission) => {
        const isAccepted = submission.status === "Accepted";
        const avgTime = calcAvg(submission.time, 'time');
        const avgMemory = calcAvg(submission.memory, 'memory');

        return (
          <div
            key={submission.id}
            className={`card shadow-lg hover:shadow-xl transition-shadow rounded-xl border ${
              isAccepted ? 'border-success/20 bg-success/5' : 'border-error/20 bg-base-200'
            }`}
          >
            <div className="card-body p-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                {/* Left: status + language */}
                <div className="flex items-center gap-4">
                  {isAccepted ? (
                    <div className="flex items-center gap-2 text-success font-bold">
                      <CheckCircle2 className="w-5 h-5" /> Accepted
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-error font-bold">
                      <XCircle className="w-5 h-5" /> {submission.status}
                    </div>
                  )}
                  <div className="badge badge-neutral text-xs">{submission.language}</div>
                </div>

                {/* Right: perf + date */}
                <div className="flex items-center gap-4 text-base-content/60 text-sm flex-wrap">
                  {avgTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> {avgTime}
                    </div>
                  )}
                  {avgMemory && (
                    <div className="flex items-center gap-1">
                      <Cpu className="w-4 h-4" /> {avgMemory}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SubmissionsList;
