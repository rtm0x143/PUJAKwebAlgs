const canvas = document.querySelector(".canvas");
const resizeIcon = document.querySelector(".resize-block");
const BORDER_SIZE_X = 4;
const BORDER_SIZE_Y = 4;

let mousePosX;
let mousePosY;

function resize(e) {
    const dx = e.x - mousePosX;
    const dy = e.y - mousePosY;
    mousePosX = e.x;
    mousePosY = e.y;

    canvas.style.width = parseInt(getComputedStyle(canvas, '').width) + dx + "px";
    canvas.style.height = parseInt(getComputedStyle(canvas, '').height) + dy + "px";
}

resizeIcon.addEventListener("mousedown", (e) => {
    // if (e.offsetX > BORDER_SIZE_X && e.offsetY > BORDER_SIZE_Y) {
        mousePosX = e.x;
        mousePosY = e.y;
        document.addEventListener("mousemove", resize, false);
    // }
});

document.addEventListener("mouseup", () => {
    document.removeEventListener("mousemove", resize, false);   
});