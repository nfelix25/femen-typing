(() => {
    let app;

    document.addEventListener("DOMContentLoaded", () => {
        app = new App();
    });
})();

const difficulties = ["Easy", "Medium", "Hard"];
const modes = ["Timed", "Passage"];

class App {
    #timer = document.getElementById("time");
    #toggle = document.getElementById("time-toggle");
    #reset = document.getElementById("reset-timer");
    #typing = document.getElementById("typing-entry");

    #difficulties = document.getElementById("difficulty-selector");
    #modes = document.getElementById("mode-selector");

    #difficultyIdx = 0;
    #modeIdx = 0;

    #selection;
    #selectionId;
    #selectionElements;
    #selectionIdx = 0;

    constructor() {
        this.#timer.time = 0;
        this.#reset.button.disabled = true;

        this.#difficulties.chips[this.#difficultyIdx].select();
        this.#modes.chips[this.#modeIdx].select();

        this.#reset.addEventListener("click", () => {
            this.#timer.reset();
            setTimeout(() => {
                this.#reset.button.disabled = this.#timer.time === 0;
            });
        });

        document.addEventListener("toggle", (event) => {
            if (this.#reset.button.disabled) {
                this.#reset.button.disabled = false;
            }

            if (event.target.id === this.#toggle.id) {
                if (event.detail.toggled) {
                    this.#timer.start();
                } else {
                    this.#timer.end();
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
            this.#toggle.toggled = false;
        }, 60000);

        this.loadData();
    }

    async loadData() {
        const difficulty =
            difficulties[this.#difficultyIdx].toLocaleLowerCase();
        const res = await fetch("http://localhost:3000/generate_test", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ difficulty, language: "TypeScript" }),
        });
        console.log(res);

        const selection = await res.json();

        console.log(selection);

        this.#selection = selection.test;
        // this.#selectionId = selection.id;

        this.#typing.innerHTML = Array.from(this.#selection)
            .map((c) =>
                c === "\n"
                    ? `<span data-newline><br></span>`
                    : `<span>${c}</span>`,
            )
            .join("");

        this.#selectionElements = this.#typing.querySelectorAll("span");
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
