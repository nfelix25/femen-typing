import "./components/button/my-button.js";
import "./components/text/my-text.js";

import elements from "./elements.js";
import { DIFFICULTIES, ENTER_SYMBOL, MODES } from "./constants.js";
import Language from "./language.js";

(() => {
    let app;

    document.addEventListener("DOMContentLoaded", () => {
        app = new App();
    });
})();

class App {
    #languages;

    #difficultyIdx = 0;
    #modeIdx = 0;
    #selectionIdx = 0;

    #selection;
    #selectionId;
    #selectionElements;

    constructor() {
        elements.timer.time = 0;
        elements.reset.button.disabled = true;

        elements.difficulties.chips[this.#difficultyIdx].select();
        elements.modes.chips[this.#modeIdx].select();

        elements.reset.addEventListener("click", () => {
            elements.timer.reset();
            setTimeout(() => {
                elements.reset.button.disabled = elements.timer.time === 0;
            });
        });

        document.addEventListener("toggle", (event) => {
            if (elements.reset.button.disabled) {
                elements.reset.button.disabled = false;
            }

            if (event.target.id === elements.toggle.id) {
                if (event.detail.toggled) {
                    elements.timer.start();
                } else {
                    elements.timer.end();
                }
            }
        });

        document.addEventListener("chip-select", (event) => {
            if (event.target.id === "difficulty-selector") {
                this.#difficultyIdx = event.detail.selectedIndex;
                this.loadData();
            } else if (event.target.id === "mode-selector") {
                this.#modeIdx = event.detail.selectedIndex;
            }
        });

        document.addEventListener("test-keypress", (event) => {
            this.handleTestKeypress(event.detail.key);
        });

        setTimeout(() => {
            elements.toggle.toggled = false;
        }, 60000);

        this.initializeLanguages().then(() => {
            this.loadData();
        });
    }

    async initializeLanguages() {
        const { languageStats } = await (
            await fetch("http://localhost:3000/language_stats")
        ).json();

        const languages = languageStats.map((l) => new Language(l));

        this.#languages = languages;
    }

    async loadData() {
        const difficulty =
            DIFFICULTIES[this.#difficultyIdx].toLocaleLowerCase();
        // const res = await fetch("http://localhost:3000/generate_test", {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify({ difficulty, language: "TypeScript" }),
        // });
        // console.log(res);
        const std = this.#languages.find((l) => l.language === "standard");
        console.log(this.#languages);
        const res = await std.getRandomExistingTest(difficulty);
        console.log(res);
        const selection = await res.json();

        console.log(selection);

        this.#selection = selection.test.text;

        const words = this.#selection
            .split(" ")
            .map(
                (w) =>
                    `<span class="word-span">${Array.from(w)
                        .map((c) =>
                            c === "\n"
                                ? `<span class="char-span" data-newline>${ENTER_SYMBOL}<br></span>`
                                : `<span class="char-span">${c}</span>`,
                        )
                        .join("")}</span>`,
            )
            .join("<span class='char-span'> </span>");

        elements.typing.innerHTML = words;

        this.#selectionElements =
            elements.typing.querySelectorAll("span.char-span");
        this.#selectionElements[this.#selectionIdx].classList.add("current");
    }

    handleTestKeypress(char) {
        console.log(`Key pressed in App: ${char}`);

        const expected = this.#selection[this.#selectionIdx];
        const normalized = char === "Enter" ? "\n" : char;
        const el = this.#selectionElements[this.#selectionIdx];

        el.classList.remove("current");

        if (normalized === expected) {
            el.classList.add("correct");
        } else {
            el.classList.add("incorrect");
        }

        this.#selectionIdx++;

        // Auto-advance through leading whitespace after a newline
        if (normalized === "\n") {
            while (
                this.#selectionIdx < this.#selection.length &&
                (this.#selection[this.#selectionIdx] === " " ||
                    this.#selection[this.#selectionIdx] === "\t")
            ) {
                this.#selectionElements[this.#selectionIdx].classList.add(
                    "correct",
                );
                this.#selectionIdx++;
            }
        }

        this.#selectionElements[this.#selectionIdx].classList.add("current");
    }
}
