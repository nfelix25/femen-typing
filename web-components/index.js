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
        const path = "./data.json";

        const data = await fetch(path);

        const json = await data.json();

        const dataFilteredForDifficulty =
            json[difficulties[this.#difficultyIdx].toLocaleLowerCase()];

        const selection =
            dataFilteredForDifficulty[
                Math.floor(Math.random() * dataFilteredForDifficulty.length)
            ];

        this.#selection = selection.text;
        this.#selectionId = selection.id;

        this.#typing.innerHTML = Array.from(selection.text)
            .map((c) => `<span>${c}</span>`)
            .join("");

        this.#selectionElements = this.#typing.querySelectorAll("span");
        this.#selectionElements[this.#selectionIdx].classList.add("current");
    }

    handleTestKeypress(char) {
        console.log(`Key pressed in App: ${char}`);
        const el = this.#selectionElements[this.#selectionIdx];

        el.classList.remove("current");

        if (char === this.#selection[this.#selectionIdx]) {
            el.classList.add("correct");
        } else {
            el.classList.add("incorrect");
        }

        this.#selectionElements[++this.#selectionIdx].classList.add("current");
    }
}
