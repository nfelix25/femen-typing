import process from "node:process";
import path from "node:path";
import express from "express";

import dotenv from "dotenv";
import OpenAI from "openai";

const __filename = new URL(import.meta.url).pathname;
const __dirname = __filename.substring(0, __filename.lastIndexOf("/"));

dotenv.config({ path: `${__dirname}/.env` });

const STATIC_DIRNAME = process.env.STATIC_DIRNAME || "web-components";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, STATIC_DIRNAME)));

export const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

app.post("/generate_test", async (req, res) => {
    const { difficulty, language } = req.body;

    const instructions =
        "You are a typing test generator. Your task is to create a programming typing test that is both educational and engaging. The test should consist of a code snippet that users will type out to improve their typing speed and accuracy while also learning programming concepts.";

    const input = `Generate a programming typing test in ${language} at ${difficulty} difficulty.

        The difficulty should reflect the typing test's complexity, with "easy" being simple code snippets and "hard" being more complex code. The test should be a learning experience from a coding perspective as well as an engaging typing challenge.

        Output ONLY the raw code snippet — no markdown, no backticks, no explanation.
        The snippet should be realistic, and idiomatic for ${language}.`;

    const response = await client.responses.create({
        model: "gpt-5.1-codex-mini",
        instructions,
        input,
    });

    res.json({ test: response.output_text });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});
