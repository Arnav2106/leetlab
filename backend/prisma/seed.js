import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

// Helper to wait
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

async function main() {
    console.log("Seeding database with ~500 algorithm problems...");

    // Since finding a stable open API for 500 questions can be tricky without an API key,
    // we will pull a batch of questions from a public github repository containing alldata.
    // We'll use a mocked robust dataset for demonstration, or generate them programmatically.

    // We will generate a base set of 500 detailed questions programmatically for this project.
    const difficulties = ["EASY", "MEDIUM", "HARD"];
    const tagsList = ["Array", "String", "Hash Table", "Dynamic Programming", "Math", "Sorting"];

    // 1. Ensure we have at least one user to assign as the creator of these problems
    let adminUser = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });

    if (!adminUser) {
        adminUser = await prisma.user.create({
            data: {
                name: "System Admin",
                email: "admin@leetlab.com",
                password: "hashedpassword123", // In actual app, this should be actually hashed
                role: "ADMIN",
            },
        });
        console.log("Created System Admin user.");
    }

    const problemsToCreate = [];

    for (let i = 1; i <= 500; i++) {
        const defaultCodeSnippets = {
            JAVASCRIPT: `function solveProblem${i}(input) {\n  // Write your code here\n  return input;\n}`,
            PYTHON: `def solve_problem_${i}(input):\n    # Write your code here\n    return input`,
            JAVA: `class Solution {\n    public Object solveProblem${i}(Object input) {\n        // Write your code here\n        return input;\n    }\n}`,
            "C++": `class Solution {\npublic:\n    auto solveProblem${i}(auto input) {\n        // Write your code here\n        return input;\n    }\n};`,
        };

        const defaultTestcases = [
            { input: "1\n2", output: "3" },
            { input: "5\n5", output: "10" },
        ];

        const defaultExamples = {
            example1: {
                input: "1, 2",
                output: "3",
                explanation: "Basic addition test.",
            },
        };

        problemsToCreate.push({
            title: `Algorithm Challenge #${i}`,
            description: `This is the detailed description for algorithm challenge #${i}. Solve it efficiently!`,
            difficulty: difficulties[i % 3],
            userId: adminUser.id,
            examples: defaultExamples,
            constraints: "1 <= input.length <= 10^5\nTime Limit: 2s",
            hints: i % 2 === 0 ? `Try using a ${tagsList[i % tagsList.length]}` : null,
            editorial: "The optimal solution involves O(n) time complexity...",
            testcases: defaultTestcases,
            codeSnippets: defaultCodeSnippets,
            referenceSolutions: defaultCodeSnippets, // Simplified for seeding
        });
    }

    // Insert in batches of 50
    let batchSize = 50;
    for (let i = 0; i < problemsToCreate.length; i += batchSize) {
        const batch = problemsToCreate.slice(i, i + batchSize);
        await prisma.problem.createMany({
            data: batch,
            skipDuplicates: true,
        });
        console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(problemsToCreate.length / batchSize)}`);
    }

    console.log("✅ Successfully seeded 500 problems!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
