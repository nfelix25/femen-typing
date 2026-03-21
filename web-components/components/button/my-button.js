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

class MyChip extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const label = this.getAttribute("label") ?? this.textContent;
        const cls = this.getAttribute("class") ?? "chippy";

        this.innerHTML = `<button data-label=${label} class="text-preset-5 ${cls}">${label}</button>`;
    }

    get button() {
        return this.querySelector("button");
    }

    select() {
        this.button.classList.add("selected");
    }

    deselect() {
        this.button.classList.remove("selected");
        this.button.classList.add("deselecting");
        setTimeout(() => this.button.classList.remove("deselecting"), 300);
    }
}

class ChipGroup extends HTMLElement {
    #_selectedChipIndex = 0;

    constructor() {
        super();
    }

    connectedCallback() {
        const chips = this.chips;
        chips.forEach((chip, idx) => {
            chip.button.addEventListener("click", () => {
                if (idx !== this.#_selectedChipIndex) {
                    this.handleSelection(idx);
                }
            });
        });
    }

    get chips() {
        return this.querySelectorAll("my-chip");
    }

    handleSelection(chipIndex) {
        if (chipIndex < this.#_selectedChipIndex) {
            this.classList.add("left");
        } else {
            this.classList.add("right");
        }

        this.chips[this.#_selectedChipIndex].deselect();
        this.chips[chipIndex].select();

        setTimeout(() => {
            this.classList.remove("left", "right");
        }, 300);

        this.#_selectedChipIndex = chipIndex;

        this.dispatchEvent(
            new CustomEvent("chip-select", {
                bubbles: true,
                detail: { selectedIndex: chipIndex },
            }),
        );
    }
}

customElements.define("my-button", MyButton);
customElements.define("my-toggle", MyToggleButton);
customElements.define("my-chip", MyChip);
customElements.define("chip-group", ChipGroup);
