import { askLLM } from "./llm.js";
import { getWeather } from "./tools/weatherTool.js";

export async function runAgent(query) {
    try {
        const messages = [
            {
                role: "system",
                content: `
/no_think

You are a weather agent.

Analyze the user's query and decide whether the weather tool is required.

If weather information is required, return ONLY valid JSON:

{
    "tool": "weather",
    "city": "city name"
}

If weather information is not required, return ONLY:

{
    "tool": "none"
}

Rules:
- Return JSON only.
- Do not use markdown.
- Do not add explanation.
- Do not use code blocks.
- Do not output thinking.
`
            },
            {
                role: "user",
                content: query
            }
        ];

        const decision = await askLLM(messages);

        console.log("\nLLM Decision:");
        console.log(decision);

        const cleanedDecision = decision
            .replace(/<think>[\s\S]*?<\/think>/g, "")
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        console.log("\nCleaned Decision:");
        console.log(cleanedDecision);

        let parsedDecision;

        try {
            parsedDecision = JSON.parse(cleanedDecision);
        } catch (error) {
            console.log("JSON Parse Error:", error.message);

            return "The agent could not understand the model decision.";
        }

        if (parsedDecision.tool === "weather") {
            console.log("\nCalling Weather Tool...");

            const weatherData = await getWeather(
                parsedDecision.city
            );

            console.log("\nWeather Tool Result:");
            console.log(weatherData);

            if (weatherData.error) {
                return weatherData.error;
            }

            const finalMessages = [
                {
                    role: "system",
                    content: `
/no_think

You are a helpful weather assistant.

Answer the user's question using only the weather data provided.

Rules:
- Keep the answer clear.
- Do not invent weather data.
- Do not mention internal tools.
- Do not output thinking.
`
                },
                {
                    role: "user",
                    content: `
User question:

${query}

Weather data:

${JSON.stringify(weatherData, null, 2)}
`
                }
            ];

            const finalResponse = await askLLM(finalMessages);

            const cleanedResponse = finalResponse
                .replace(/<think>[\s\S]*?<\/think>/g, "")
                .trim();

            return cleanedResponse;
        }

        return "I am currently a weather-only agent.";

    } catch (error) {
        console.error("Agent Error:", error);

        return "Something went wrong while running the agent.";
    }
}
