class MyText extends HTMLElement {
    connectedCallback() {
        const cls = this.getAttribute("class") ?? "";
        const bold = this.hasAttribute("bold") ? "font-bold" : "";
        const semiBold = this.hasAttribute("semi-bold") ? "semi-bold" : "";
        const preset = this.getAttribute("preset") ?? "1";
        const variant = this.getAttribute("variant") ?? "default";

        const classStr =
            `text-preset-${preset} ${bold} ${semiBold} ${cls} text-${variant}`.trim();
        const content = this.textContent;

        this.innerHTML = `<span class="${classStr}">${content}</span>`;
    }
}

customElements.define("my-text", MyText);
