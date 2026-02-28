import { db } from "../libs/db.js";

/**
 * POST /api/v1/rate-code
 * Body: { submissionId }
 * Returns a detailed rating object with score, breakdown, and suggestions.
 */
export const rateCode = async (req, res) => {
    try {
        const { submissionId } = req.body;
        const userId = req.user.id;

        if (!submissionId) {
            return res.status(400).json({ error: "submissionId is required" });
        }

        // Fetch the submission with its test case results
        const submission = await db.submission.findUnique({
            where: { id: submissionId },
            include: { testCases: true, problem: true },
        });

        if (!submission) {
            return res.status(404).json({ error: "Submission not found" });
        }

        if (submission.userId !== userId) {
            return res.status(403).json({ error: "Unauthorized" });
        }

        // ─── Scoring breakdown ────────────────────────────────────────────────────
        const totalTests = submission.testCases.length || 1;
        const passedTests = submission.testCases.filter((tc) => tc.passed).length;
        const passRate = passedTests / totalTests; // 0 – 1

        // 1. Correctness (0 – 40 points)
        const correctnessScore = Math.round(passRate * 40);

        // 2. Efficiency — based on execution time reported by Piston (0 – 25 points)
        let efficiencyScore = 20; // default if no timing data
        if (submission.time) {
            const ms = parseFloat(submission.time);
            if (!isNaN(ms)) {
                if (ms < 50) efficiencyScore = 25;
                else if (ms < 150) efficiencyScore = 22;
                else if (ms < 500) efficiencyScore = 18;
                else if (ms < 2000) efficiencyScore = 12;
                else efficiencyScore = 6;
            }
        }

        // 3. Code length / conciseness (0 – 15 points)
        let conciseScore = 10;
        try {
            const code = JSON.stringify(submission.sourceCode);
            const loc = code.split("\\n").length;
            if (loc <= 10) conciseScore = 15;
            else if (loc <= 20) conciseScore = 13;
            else if (loc <= 35) conciseScore = 10;
            else if (loc <= 60) conciseScore = 7;
            else conciseScore = 4;
        } catch (_) { }

        // 4. Speed bonus — time spent solving (0 – 10 points)
        let speedScore = 5;
        if (submission.timeSpent != null) {
            const mins = submission.timeSpent / 60;
            if (mins < 5) speedScore = 10;
            else if (mins < 15) speedScore = 8;
            else if (mins < 30) speedScore = 6;
            else if (mins < 60) speedScore = 4;
            else speedScore = 2;
        }

        // 5. Status bonus (0 – 10 points)
        const statusScore =
            submission.status === "Accepted" ? 10 : submission.status === "Runtime Error" ? 2 : 5;

        const totalScore = correctnessScore + efficiencyScore + conciseScore + speedScore + statusScore;

        // ─── Grade label ───────────────────────────────────────────────────────────
        let grade, label, color;
        if (totalScore >= 90) { grade = "S"; label = "Exceptional"; color = "text-yellow-400"; }
        else if (totalScore >= 80) { grade = "A"; label = "Excellent"; color = "text-green-400"; }
        else if (totalScore >= 70) { grade = "B"; label = "Good"; color = "text-blue-400"; }
        else if (totalScore >= 55) { grade = "C"; label = "Average"; color = "text-orange-400"; }
        else { grade = "D"; label = "Needs Work"; color = "text-red-400"; }

        // ─── Suggestions ──────────────────────────────────────────────────────────
        const suggestions = [];
        if (passRate < 1) suggestions.push("Not all test cases passed — review edge cases carefully.");
        if (efficiencyScore < 18) suggestions.push("Your solution may be slow — consider a more optimal algorithm (e.g., HashMap, Binary Search).");
        if (conciseScore < 10) suggestions.push("Your code has many lines. Consider DRY (Don't Repeat Yourself) principles.");
        if (speedScore < 6) suggestions.push("You took a while on this problem. Practice similar problems to improve your speed.");
        if (!suggestions.length) suggestions.push("🎉 Great job! Clean, correct, and efficient solution.");

        return res.status(200).json({
            success: true,
            rating: {
                totalScore,
                grade,
                label,
                color,
                breakdown: {
                    correctness: { score: correctnessScore, max: 40, detail: `${passedTests}/${totalTests} tests passed` },
                    efficiency: { score: efficiencyScore, max: 25, detail: submission.time ? `${submission.time}ms` : "No timing data" },
                    conciseness: { score: conciseScore, max: 15, detail: "Based on lines of code" },
                    speed: { score: speedScore, max: 10, detail: submission.timeSpent ? `${Math.round(submission.timeSpent / 60)} min` : "N/A" },
                    status: { score: statusScore, max: 10, detail: submission.status },
                },
                suggestions,
            },
        });
    } catch (error) {
        console.error("Error rating code:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
