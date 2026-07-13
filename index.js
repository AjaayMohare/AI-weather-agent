import readline from "readline";
import { runAgent } from "./src/agent.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion() {
    rl.question("\nYou: ", async (query) => {
        if (query.toLowerCase() === "exit") {
            console.log("Weather Agent stopped.");
            rl.close();
            return;
        }

        const response = await runAgent(query);

        console.log("\nAgent:");
        console.log(response);

        askQuestion();
    });
}

console.log("Weather Agent Started");
console.log("Type 'exit' to stop.");

askQuestion();