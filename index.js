(() => {
    let interval, start;

    function begin() {
        document.addEventListener("DOMContentLoaded", () => {
            const el = document.getElementById("time");

            interval = setInterval(() => {
                el.innerText = new Date().toLocaleTimeString();
            }, 1000);
        });
    }

    function end() {}
})();
