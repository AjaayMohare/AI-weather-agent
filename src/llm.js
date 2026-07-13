import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const client = new InferenceClient(process.env.HF_TOKEN);

export async function askLLM(messages) {
    try {
        const response = await client.chatCompletion({
            model: "Qwen/Qwen3-32B",
            messages: messages,
            max_tokens: 200
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("LLM Error:", error);
        throw error;
    }
}
