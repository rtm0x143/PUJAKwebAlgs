import Errors from '../config/Errors.js';

class CanvasView {
    private _mousePosX = 0;
    private _mousePosY = 0;

    public resizeIcon: HTMLDivElement;

    constructor() {
        this.resizeIcon = document.querySelector('.resizeIcon') ?? Errors.handleError('null');
    }

    resize(canvas: HTMLCanvasElement, e: MouseEvent, callback: Function): void {
        const dx: number = e.clientX - this._mousePosX;
        const dy: number = e.clientY - this._mousePosY;

        this._mousePosX = e.clientX;
        this._mousePosY = e.clientY;

        callback(dx, dy, canvas);

        // canvas.style.width = parseInt(getComputedStyle(canvas, '').width, 10) + 2 * dx + "px";
        // canvas.style.height = parseInt(getComputedStyle(canvas, '').height, 10) + 2 * dy + "px";
    }

    drawGrid(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, color: string, columnCount: number, rowsCount: number) {
        context.strokeStyle = color;
        for (let i = 0; i < columnCount; ++i) {
            for (let j = 0; j < rowsCount; ++j) {
                context.strokeRect(i * canvas.width / columnCount, j * canvas.height / rowsCount, canvas.width / columnCount, canvas.height / rowsCount);
            }
        }
    }

    drawCircle(canvasContext: CanvasRenderingContext2D, strokeColor: string, fillColor: string, x: number, y: number, radius: number) {
        canvasContext.strokeStyle = strokeColor;
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
        canvasContext.stroke();
        canvasContext.fill();
    }

    subscribe() {

    }
}

export default CanvasView;
