import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { Star, Zap, Clock, Code, CheckCircle, TrendingUp, X, Loader } from "lucide-react";

const CodeRater = ({ submissionId, onClose }) => {
    const [rating, setRating] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRating = async () => {
        if (!submissionId) {
            setError("No submission ID provided. Submit your solution first!");
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const res = await axiosInstance.post("/rate-code", { submissionId });
            setRating(res.data.rating);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to rate code. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const gradeColors = {
        S: "text-yellow-400 border-yellow-400",
        A: "text-green-400 border-green-400",
        B: "text-blue-400 border-blue-400",
        C: "text-orange-400 border-orange-400",
        D: "text-red-400 border-red-400",
    };

    const breakdownIcons = {
        correctness: <CheckCircle size={14} />,
        efficiency: <Zap size={14} />,
        conciseness: <Code size={14} />,
        speed: <Clock size={14} />,
        status: <TrendingUp size={14} />,
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md mx-4 bg-base-200 border border-white/10 rounded-3xl shadow-2xl p-6 space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Star className="text-primary" size={22} />
                        <h2 className="text-xl font-bold">Code Rater</h2>
                    </div>
                    <button onClick={onClose} className="btn btn-ghost btn-sm btn-circle">
                        <X size={18} />
                    </button>
                </div>

                {!rating && !loading && (
                    <div className="text-center space-y-4 py-4">
                        <p className="text-base-content/70">
                            Get an AI-powered quality score for your submitted solution based on correctness, efficiency, conciseness, and speed.
                        </p>
                        {error && (
                            <div className="alert alert-error text-sm py-2 rounded-xl">{error}</div>
                        )}
                        <button
                            onClick={fetchRating}
                            className="btn btn-primary w-full gap-2 rounded-xl"
                        >
                            <Star size={16} />
                            Rate My Code
                        </button>
                    </div>
                )}

                {loading && (
                    <div className="flex flex-col items-center justify-center py-10 gap-4">
                        <Loader className="animate-spin text-primary" size={36} />
                        <p className="text-base-content/60 text-sm">Analyzing your solution…</p>
                    </div>
                )}

                {rating && (
                    <div className="space-y-4">
                        {/* Grade Circle */}
                        <div className="flex flex-col items-center py-2 gap-1">
                            <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${gradeColors[rating.grade]}`}>
                                <span className="text-5xl font-black">{rating.grade}</span>
                            </div>
                            <p className="font-bold text-lg">{rating.label}</p>
                            <p className="text-base-content/50 text-sm">{rating.totalScore} / 100 points</p>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-base-300 rounded-full h-3 overflow-hidden">
                            <div
                                className="h-3 rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-700"
                                style={{ width: `${rating.totalScore}%` }}
                            />
                        </div>

                        {/* Breakdown */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-widest">Score Breakdown</p>
                            {Object.entries(rating.breakdown).map(([key, val]) => (
                                <div key={key} className="flex items-center justify-between bg-base-300/60 px-4 py-2 rounded-xl text-sm">
                                    <div className="flex items-center gap-2 capitalize text-base-content/80">
                                        <span className="text-primary">{breakdownIcons[key]}</span>
                                        {key}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-base-content/50 text-xs">{val.detail}</span>
                                        <span className="font-bold text-primary">{val.score}/{val.max}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Suggestions */}
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-base-content/50 uppercase tracking-widest">Suggestions</p>
                            {rating.suggestions.map((s, i) => (
                                <div key={i} className="flex items-start gap-2 bg-base-300/40 px-4 py-2 rounded-xl text-sm text-base-content/80">
                                    <span className="text-primary mt-0.5">•</span> {s}
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => setRating(null)}
                            className="btn btn-ghost btn-sm w-full rounded-xl"
                        >
                            Rate Again
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodeRater;
