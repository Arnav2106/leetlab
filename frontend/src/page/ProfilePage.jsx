import React, { useEffect, useMemo } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useProblemStore } from "../store/useProblemStore";
import { Loader, CheckCircle, Code, Shield } from "lucide-react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
    const { authUser } = useAuthStore();
    const { solvedProblems, getSolvedProblemByUser, isProblemsLoading } = useProblemStore();

    useEffect(() => {
        getSolvedProblemByUser();
    }, [getSolvedProblemByUser]);

    // Derive simple statistics
    const stats = useMemo(() => {
        if (!solvedProblems) return { easy: 0, medium: 0, hard: 0 };
        let easy = 0;
        let medium = 0;
        let hard = 0;

        solvedProblems.forEach((problem) => {
            if (problem.difficulty === "EASY") easy++;
            else if (problem.difficulty === "MEDIUM") medium++;
            else if (problem.difficulty === "HARD") hard++;
        });

        return { easy, medium, hard };
    }, [solvedProblems]);

    if (isProblemsLoading || !authUser) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
                <Loader className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-300 w-full pt-20 px-4 md:px-8 pb-12 relative overflow-hidden transition-colors duration-500">
            {/* Background Orbs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] pointer-events-none delay-500"></div>

            <div className="max-w-5xl mx-auto space-y-8 z-10 relative">
                <div className="flex items-center gap-4 mb-8">
                    <div className="avatar placeholder">
                        <div className="bg-primary text-primary-content rounded-full w-24 ring ring-primary ring-offset-base-100 ring-offset-2">
                            <span className="text-4xl capitalize">{authUser?.name?.charAt(0)}</span>
                        </div>
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold tracking-tight text-base-content/90">
                            {authUser?.name}
                        </h1>
                        <p className="text-lg font-medium text-base-content/60 flex items-center gap-2 mt-1">
                            {authUser?.email}
                            {authUser?.role === "ADMIN" && (
                                <span className="badge badge-error gap-1 uppercase font-bold text-xs"><Shield size={12} /> Admin</span>
                            )}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Stats Card */}
                    <div className="col-span-1 md:col-span-1 backdrop-blur-xl bg-base-100/60 p-6 border border-white/5 rounded-3xl shadow-xl space-y-6">
                        <h2 className="text-2xl font-bold border-b border-base-content/10 pb-3 flex items-center gap-2">
                            <Code className="text-primary" /> Statistics
                        </h2>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-base-200/50 rounded-xl">
                                <span className="text-success font-semibold tracking-wide">EASY</span>
                                <span className="text-xl font-bold">{stats.easy}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-base-200/50 rounded-xl">
                                <span className="text-warning font-semibold tracking-wide">MEDIUM</span>
                                <span className="text-xl font-bold">{stats.medium}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-base-200/50 rounded-xl">
                                <span className="text-error font-semibold tracking-wide">HARD</span>
                                <span className="text-xl font-bold">{stats.hard}</span>
                            </div>
                        </div>
                        <div className="divider"></div>
                        <div className="bg-base-200/80 p-4 rounded-2xl flex flex-col items-center border border-white/5">
                            <span className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary to-secondary drop-shadow-sm">
                                {solvedProblems?.length || 0}
                            </span>
                            <span className="font-semibold text-base-content/60 mt-2 uppercase tracking-widest text-sm">Solved Topics</span>
                        </div>
                    </div>

                    {/* Solved Problems List */}
                    <div className="col-span-1 md:col-span-2 backdrop-blur-xl bg-base-100/60 p-6 border border-white/5 rounded-3xl shadow-xl">
                        <h2 className="text-2xl font-bold border-b border-base-content/10 pb-3 mb-4 flex items-center gap-2">
                            <CheckCircle className="text-secondary" /> Recent Submissions
                        </h2>

                        {solvedProblems?.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="table w-full">
                                    <thead>
                                        <tr className="text-base-content/60">
                                            <th>Challenge Title</th>
                                            <th>Difficulty</th>
                                            <th>Tags</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {solvedProblems.map((problem) => (
                                            <tr key={problem.id} className="hover:bg-base-200/30 transition-colors">
                                                <td className="font-semibold">
                                                    <Link to={`/problem/${problem.id}`} className="hover:text-primary transition-colors hover:underline">
                                                        {problem.title}
                                                    </Link>
                                                </td>
                                                <td>
                                                    <span className={`badge text-xs font-bold text-white shadow-sm border-none ${problem.difficulty === "EASY" ? "bg-success/80" :
                                                            problem.difficulty === "MEDIUM" ? "bg-warning/80" : "bg-error/80"
                                                        }`}>
                                                        {problem.difficulty}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className="flex gap-1 flex-wrap">
                                                        {(problem.tags || []).slice(0, 2).map((tag, i) => (
                                                            <span key={i} className="text-[10px] bg-base-300 px-2 py-1 rounded-md opacity-80">{tag}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-12 text-center text-base-content/50">
                                <div className="bg-base-200 p-6 rounded-full mb-4 opacity-50">
                                    <Code size={48} />
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-base-content/70">No Submissions Yet</h3>
                                <p>You haven't solved any problems. Go back to the <Link to="/" className="text-primary hover:underline font-bold">Arena</Link>!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
