export default class Language {
    #language;
    #easyCount;
    #mediumCount;
    #hardCount;

    constructor(stats) {
        this.#language = stats.language;
        this.#easyCount = stats.counts.easy;
        this.#mediumCount = stats.counts.medium;
        this.#hardCount = stats.counts.hard;
    }

    get hasAny() {
        return (
            this.#easyCount > 0 || this.#mediumCount > 0 || this.#hardCount > 0
        );
    }

    get language() {
        return this.#language;
    }

    hasDifficulty(difficulty) {
        if (difficulty === "easy") {
            return this.#easyCount > 0;
        } else if (difficulty === "medium") {
            return this.#mediumCount > 0;
        } else if (difficulty === "hard") {
            return this.#hardCount > 0;
        }
    }

    async getNewTest(difficulty) {
        return await fetch(
            `http://localhost:3000/new_test?language=${this.#language}&difficulty=${difficulty}`,
        );
    }

    async getRandomExistingTest(difficulty) {
        return await fetch(
            `http://localhost:3000/random_test?language=${this.#language}&difficulty=${difficulty}`,
        );
    }
}
