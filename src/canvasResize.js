const canvas = document.getElementById('canvas_astar');
const BORDER_SIZE_X = 10;
const BORDER_SIZE_Y = 10;

let mousePosX;
let mousePosY;

function resize(e) {
    const dx = mousePosX - e.x;
    const dy = mousePosY - e.y;
    mousePosX = e.x;
    mousePosY = e.y;

    canvas.style.width = (parseInt(getComputedStyle(canvas, '').width) + dx) + "px";
    canvas.style.height = (parseInt(getComputedStyle(canvas, '').height) + dy) + "px";
}

canvas.addEventListener('mousedown', (e) => {
    if (e.offsetX < BORDER_SIZE_X && e.offsetY < BORDER_SIZE_Y) {
        mousePosX = e.x;
        mousePosY = e.y;
        document.addEventListener('mousemove', resize, false);
    }
});

document.addEventListener('mouseup', () => {
    document.removeEventListener("mousemove", resize, false);   
})