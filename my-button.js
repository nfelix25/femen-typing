class MyButton extends HTMLElement {
    connectedCallback() {
        const label = this.getAttribute("label");
        const cls = this.getAttribute("class") ?? "primary";
        const icon = this.getAttribute("icon");

        this.innerHTML = `<button class="text-preset-3 semi-bold ${cls}">${label}${icon ? `<img src="${icon}" />` : ""}</button>`;
    }

    get button() {
        return this.querySelector("button");
    }
}

class MyToggleButton extends MyButton {
    #_toggled = false;

    constructor() {
        super();
        this.#_toggled = false;

        this.addEventListener("click", () => this.toggle());
    }

    connectedCallback() {
        super.connectedCallback();
        this.button.classList.add("toggle");
        this.#update();
    }

    #update() {
        const btn = this.button;
        btn.textContent = this.#_toggled ? "OFF" : "ON";

        if (this.#_toggled) {
            this.button.classList.add("on");
            this.button.classList.remove("off");
        } else {
            this.button.classList.add("off");
            this.button.classList.remove("on");
        }
    }

    get toggled() {
        return this.#_toggled;
    }

    set toggled(value) {
        this.#_toggled = value;
        this.#update();

        this.dispatchEvent(
            new CustomEvent("toggle", {
                bubbles: true,
                detail: { toggled: this.#_toggled },
            }),
        );
    }

    toggle() {
        this.toggled = !this.toggled;
    }
}

customElements.define("my-button", MyButton);
customElements.define("my-toggle", MyToggleButton);
