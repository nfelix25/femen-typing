(() => {
    let timer;

    document.addEventListener("DOMContentLoaded", () => {
        timer = document.getElementById("time");
        timer.time = 0;

        setTimeout(() => {
            timer.end();
        }, 60000);
    });

    document.addEventListener("toggle", (event) => {
        if (event.target.id === "time-toggle") {
            if (event.detail.toggled) {
                timer.start();
            } else {
                timer.end();
            }
        }
    });
})();
