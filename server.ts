import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import express from "express";

import dotenv from "dotenv";
import OpenAI from "openai";

const __filename = new URL(import.meta.url).pathname;
const __dirname = __filename.substring(0, __filename.lastIndexOf("/"));

dotenv.config({ path: `${__dirname}/.env` });

const STATIC_DIRNAME = process.env.STATIC_DIRNAME || "web-components";
const DATA_JSON_PATH = `${__dirname}/data.json`;

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.static(path.join(__dirname, STATIC_DIRNAME)));

export const client = new OpenAI({
    apiKey: process.env["OPENAI_API_KEY"],
});

app.get("/new_test", async (req, res) => {
    const { difficulty, language } = req.query;

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

type Test = {
    id: string;
    text: string;
};

type Difficulty = "easy" | "medium" | "hard";

type TestJSON = Record<string, Record<Difficulty, Test[]>>;

app.get("/random_test", async (req, res) => {
    const { difficulty, language } = req.query;

    if (typeof language !== "string" || typeof difficulty !== "string") {
        res.status(400).json({ error: "Invalid query params" });
        return;
    }

    const data = loadDataJSON() as TestJSON;
    const languageDifficultyData = data?.[language]?.[difficulty as Difficulty];

    if (!languageDifficultyData || languageDifficultyData.length === 0) {
        res.status(404).json({
            error: "No tests found for the specified language and difficulty",
        });
        return;
    }

    res.json({
        test: languageDifficultyData[
            Math.floor(Math.random() * languageDifficultyData.length)
        ],
    });
});

app.get("/language_stats", (_, res) => {
    const data = loadDataJSON() as TestJSON;

    const languageStats = Object.keys(data).map((language) => ({
        language,
        counts: {
            easy: data[language]?.easy.length,
            medium: data[language]?.medium.length,
            hard: data[language]?.hard.length,
        },
    }));

    res.json({ languageStats });
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});

function loadDataJSON() {
    if (!fs.existsSync(DATA_JSON_PATH)) {
        return {};
    }

    const data = fs.readFileSync(DATA_JSON_PATH, "utf-8");
    return JSON.parse(data);
}

type Language = "standard" | "typescript" | "javascript";

function storeToJSON(text: string, difficulty: string, language: Language) {}
