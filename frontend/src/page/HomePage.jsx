import React, { useEffect } from "react";

import { useProblemStore } from "../store/useProblemStore";
import { Loader } from "lucide-react";
import ProblemTable from "../components/ProblemTable";

const HomePage = () => {
  const { getAllProblems, problems, isProblemsLoading } = useProblemStore();

  useEffect(() => {
    getAllProblems();
  }, [getAllProblems]);

  if (isProblemsLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center pt-20 px-4 relative overflow-hidden bg-base-300 w-full transition-colors duration-500">
      {/* Background Orbs for Premium Aesthetics */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="text-center z-10 space-y-6 max-w-3xl mb-12">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary drop-shadow-sm">
          Welcome to <span className="text-white drop-shadow-lg">LeetLab</span>
        </h1>
        <p className="text-lg md:text-xl font-medium text-base-content/70 leading-relaxed">
          The ultimate platform to master coding interviews. Solve algorithmic challenges, compete with your peers, and level up your software engineering career.
        </p>
      </div>

      <div className="w-full max-w-6xl z-10 backdrop-blur-xl bg-base-100/60 p-6 md:p-8 border border-white/10 rounded-3xl shadow-2xl transition-all duration-300 hover:shadow-primary/20 hover:border-white/20">
        {problems.length > 0 ? (
          <ProblemTable problems={problems} />
        ) : (
          <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl bg-base-200/50 border border-dashed border-primary/50">
            <h3 className="text-2xl font-bold text-base-content mb-2">No Problems Found</h3>
            <p className="text-base-content/60">It looks like the problem set hasn't been seeded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
