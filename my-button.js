class MyButton extends HTMLElement {
    connectedCallback() {
        const label = this.getAttribute("label");
        const cls = this.getAttribute("class") ?? "primary";
        const icon = this.getAttribute("icon");

        this.innerHTML = `<button class="text-preset-3 semi-bold ${cls}">${label}${icon ? `<img src="${icon}" />` : ""}</button>`;

        this.querySelector("button").addEventListener("click", () => {
            this.handleClick();
        });
    }

    handleClick() {
        console.log("Button clicked!");
    }
}

customElements.define("my-button", MyButton);
