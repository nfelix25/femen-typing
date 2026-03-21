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

    #difficulties = document.getElementById("difficulty-selector");
    #modes = document.getElementById("mode-selector");

    #difficultyIdx = 0;
    #modeIdx = 0;

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
            if (event.target.parentElement.id === "difficulty-selector") {
                this.#difficultyIdx = event.detail.selectedIndex;
            } else if (event.target.parentElement.id === "mode-selector") {
                this.#modeIdx = event.detail.selectedIndex;
            }
        });

        setTimeout(() => {
            this.#toggle.toggled = false;
        }, 60000);
    }
}
