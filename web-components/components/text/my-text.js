class MyText extends HTMLElement {
    #_class;
    #_bold;
    #_semiBold;
    #_preset;
    #_variant;
    #_hasShadow;

    constructor({
        className,
        bold,
        semiBold,
        preset,
        variant,
        hasShadow = false,
    } = {}) {
        super();

        this.#_class = className;
        this.#_bold = bold;
        this.#_semiBold = semiBold;
        this.#_preset = preset;
        this.#_variant = variant;
        this.#_hasShadow = hasShadow;
    }

    #composeClass() {
        const classDef = "";
        const boldDef = "";
        const semiBoldDef = "";
        const presetDef = "1";
        const variantDef = "default";

        const cls = this.#_class ?? this.getAttribute("class") ?? classDef;
        const bold =
            (this.#_bold ?? this.hasAttribute("bold")) ? "font-bold" : boldDef;
        const semiBold =
            (this.#_semiBold ?? this.hasAttribute("semi-bold"))
                ? "semi-bold"
                : semiBoldDef;
        const preset =
            this.#_preset ?? this.getAttribute("preset") ?? presetDef;
        const variant =
            this.#_variant ?? this.getAttribute("variant") ?? variantDef;

        return `text-preset-${preset} ${bold} ${semiBold} ${cls} text-${variant}`.trim();
    }

    connectedCallback() {
        const classStr = this.#composeClass();
        const content = this.textContent;

        if (this.#_hasShadow) {
            this.shadowRoot.innerHTML = `
                <link rel="stylesheet" href="style.css">
                <span class="${classStr}"><slot></slot></span>`;
        } else {
            this.innerHTML = `<span class="${classStr}">${content}</span>`;
        }
    }
}

class MyTextTwo extends MyText {
    constructor(props) {
        super({ ...props, preset: "2" });
    }
}

class MyTextTwoSemiBold extends MyTextTwo {
    constructor(props) {
        super({ ...props, semiBold: true });
    }
}

class MyTextThree extends MyText {
    constructor(props) {
        super({ ...props, preset: "3" });
    }
}

class MyTextThreeDark extends MyTextThree {
    constructor(props) {
        super({ ...props, variant: "dark" });
    }
}

class MyTextFour extends MyText {
    constructor(props) {
        super({ ...props, preset: "4" });
    }
}

class MyTextFourDark extends MyTextFour {
    constructor(props) {
        super({ ...props, variant: "dark" });
    }
}

class MyTimer extends MyTextTwoSemiBold {
    #_curr_time = 0.0;
    #_startTime = null;
    #_frameId;

    constructor(props) {
        super({ ...props, hasShadow: true });
        // attachShadow` creates the isolated subtree and assigns it to `this.shadowRoot`. `mode: 'open'` means external JS can still access it via `element.shadowRoot` — `'closed'` would block that entirely.
        this.attachShadow({ mode: "open" });
    }

    #loop(timestamp) {
        this.time += (timestamp - this.#_startTime) / 1000;
        this.#_startTime = timestamp;
        this.#_frameId = requestAnimationFrame((ts) => {
            this.#loop(ts);
        });
    }

    start() {
        this.#_startTime = performance.now();
        this.#_frameId = requestAnimationFrame((ts) => {
            this.#loop(ts);
        });
    }

    end() {
        cancelAnimationFrame(this.#_frameId);
    }

    reset() {
        this.time = 0.0;
    }

    get time() {
        return this.#_curr_time;
    }

    set time(value) {
        this.#_curr_time = value;
        const span = this.shadowRoot?.querySelector("span");
        if (span) span.textContent = value !== 0 ? value.toFixed(2) : "-.--";
    }
}

customElements.define("my-text", MyText);
customElements.define("my-text-2", MyTextTwo);
customElements.define("my-text-2-semi", MyTextTwoSemiBold);
customElements.define("my-text-3", MyTextThree);
customElements.define("my-text-3-dark", MyTextThreeDark);
customElements.define("my-text-4", MyTextFour);
customElements.define("my-text-4-dark", MyTextFourDark);
customElements.define("my-timer", MyTimer);
