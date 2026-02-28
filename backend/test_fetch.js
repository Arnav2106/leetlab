import axios from 'axios';

async function testFetch() {
    try {
        console.log("Fetching Bhasfe's offline JSON dump...");
        const res = await axios.get("https://raw.githubusercontent.com/Bhasfe/leetcode-cheat/master/data/leetcode.json");

        console.log("Total Problems:", res.data.length);
        console.log("Sample Problem keys:", Object.keys(res.data[0]));
        console.log("Sample Problem title:", res.data[0].title);
        console.log("Sample Problem desc:", res.data[0].content ? "Present" : "Missing");
        console.log("Is question detailed enough?:", res.data[0]);
    } catch (e) {
        console.error("Fetch failed:", e.message);
    }
}

testFetch();
