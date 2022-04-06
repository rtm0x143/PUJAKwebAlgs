import Errors from '../config/Errors.js';
import CanvasModel from '../Model/canvas.model.js';

class CanvasView {
    private _mousePosX = 0;
    private _mousePosY = 0;
    private _canvasModel: CanvasModel;
        
    public canvas: HTMLCanvasElement; 
    public resizeIcon: HTMLDivElement;

    constructor(model: CanvasModel) {
        this.resizeIcon = document.querySelector('.resize-icon') ?? Errors.handleError('null');
        this.canvas = document.querySelector('.canvas') ?? Errors.handleError('null');
        this._canvasModel = model;
        this._subscribeToCanvasModel();
    }

    private _resize(e: MouseEvent, callback: Function): void {
        const dx: number = e.clientX - this._mousePosX;
        const dy: number = e.clientY - this._mousePosY;
  
        this._mousePosX = e.clientX;
        this._mousePosY = e.clientY;

        callback(this.canvas, dx, dy);

        // canvas.style.width = parseInt(getComputedStyle(canvas, '').width, 10) + 2 * dx + "px";
        // canvas.style.height = parseInt(getComputedStyle(canvas, '').height, 10) + 2 * dy + "px";
    }

    handeResizeIconElement(callback: Function) {
        this.resizeIcon.addEventListener('mousedown', (e: MouseEvent) => {
            this._mousePosX = e.clientX;
            this._mousePosY = e.clientY;
            // this._resize(e, callback);
        });
        this.resizeIcon.addEventListener('mousemove', (e: MouseEvent) => {

        });
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

    _subscribeToCanvasModel() {
        this._canvasModel.addEventListener('canvas.model:change', () => {
            this.canvas.width = this._canvasModel.width;
            this.canvas.height = this._canvasModel.height;
        });
    }
}

export default CanvasView;
