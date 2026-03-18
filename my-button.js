class MyButton extends HTMLElement {
    connectedCallback() {
        const label = this.getAttribute("label");
        this.innerHTML = `<button class="text-preset-3 semi-bold">${label}</button>`;

        this.querySelector("button").addEventListener("click", () => {
            this.handleClick();
        });
    }

    handleClick() {
        console.log("Button clicked!");
    }
}

customElements.define("my-button", MyButton);
