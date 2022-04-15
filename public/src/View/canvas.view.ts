import { collapseTextChangeRangesAcrossMultipleVersions, isThisTypeNode } from 'typescript';
import Errors from '../config/Errors.js';
import CanvasModel from '../Model/canvas.model.js';

class CanvasView {
    public readonly _canvasModel: CanvasModel; 
    public canvas: HTMLCanvasElement; 
    public canvasContext: CanvasRenderingContext2D;
    public canvasWrapper: HTMLDivElement;
    public resizeIcon: HTMLDivElement;

    constructor(model: CanvasModel) {
        this._canvasModel = model;
        this.resizeIcon = document.querySelector('.resize-icon') ?? Errors.handleError('null');
        this.canvasWrapper = document.querySelector('.canvas') ?? Errors.handleError('null');
        this.canvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        this.canvasContext = this.canvas.getContext('2d') ?? Errors.handleError("null");

        // Without this grid looks bad;
        this.canvas.width = parseInt(window.getComputedStyle(this.canvasWrapper, '').width);
        this.canvas.height = parseInt(window.getComputedStyle(this.canvasWrapper, '').height);

        this._subscribeToCanvasModel();
    }

    //#region handle resize events
    handleResize(mouseDownCallback: Function, mouseMoveCallback: Function): void {
        function mouseDownCallbackWrapper(e: MouseEvent): void {
            mouseDownCallback(e);
        }

        function mouseMoveCallbackWrapper(e: MouseEvent): void {
            mouseMoveCallback(e);
        }
        
        this.resizeIcon.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();

            mouseDownCallbackWrapper(e);
            document.addEventListener('mousemove', mouseMoveCallbackWrapper);
        });

        document.addEventListener('mouseup', () => {
            document.removeEventListener('mousemove', mouseMoveCallbackWrapper);
        });
    }
    //#endregion
    drawGridOn(context: CanvasRenderingContext2D, color: string, columnCount: number, rowsCount: number) {
        context.strokeStyle = color;
        let stepX = this.canvas.width / columnCount;
        let stepY = this.canvas.height / rowsCount;
        
        for (let i = 0; i < columnCount; ++i) {
            for (let j = 0; j < rowsCount; ++j) {
                context.strokeRect(
                    i * stepX,
                    j * stepY, 
                    stepX, 
                    stepY
                );
            }
        }
    }

    drawGrid(color: string, columnCount: number, rowsCount: number) {
        this.drawGridOn(this.canvasContext, color, columnCount, rowsCount)
    }

    drawCircle(strokeColor: string, fillColor: string, point : {x: number, y: number}, radius: number) 
    {
        this.canvasContext.strokeStyle = strokeColor;
        this.canvasContext.lineWidth = 1;
        this.canvasContext.fillStyle = fillColor;
        this.canvasContext.beginPath();
        this.canvasContext.arc(point.x, point.y, radius, 0, 2 * Math.PI);
        this.canvasContext.stroke();
        this.canvasContext.fill();
    }

    drawLine(point1 : {x: number, y: number}, point2 : {x: number, y: number}, width: number)
    {
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = "#CFCFCF";
        this.canvasContext.lineWidth = width;
        this.canvasContext.moveTo(point1.x, point1.y);
        this.canvasContext.lineTo(point2.x, point2.y);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }

    _subscribeToCanvasModel() {
        this._canvasModel.addEventListener('canvas.model:change', () => {
            this.canvasWrapper.style.width = this._canvasModel.width.toString() + "px";
            this.canvasWrapper.style.height = this._canvasModel.height.toString() + "px";
            this.canvas.width = this._canvasModel.width;
            this.canvas.height = this._canvasModel.height;
        });
    }

    hsvToRGB(h: number, s: number, v: number) {
        /// Parametres for convert 
        /// C = V * S
        /// X = C * |(1 - H / 60 % 2 - 1|)
        /// m = V - C

        /// R'G'B'
        /// (C, X, 0)  <--- 0 degr   <= H < 60 degr
        /// (X, C, 0)  <--- 60 degr  <= H < 120 degr
        /// (0, C, X)  <--- 120 degr <= H < 180 degr
        /// (0, X, C)  <--- 180 degr <= H < 240 degr
        /// (X, 0, C)  <--- 240 degr <= H < 300 degr
        /// (C, 0, X)  <--- 300 degr <= H < 360 degr
        ///R'G'B' ---> (R, G, B) === ((R'+m)*255, (G'+m)*255, (B'+m)*255)
        if (h < 60) {
            return `rgb(${(v * s + v - v * s) * 255},${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},0)`;
        }
        else if (h < 120) {
            return `rgb(${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},${(v * s + v - v * s) * 255},0)`;
        }
        else if (h < 180) {
            return `rgb(0,${(v * s + v - v * s) * 255},${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255})`;
        }
        else if (h < 240) {
            return `rgb(0,${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},${(v * s + v - v * s) * 255})`;
        }
        else if (h < 300) {
            return `rgb(${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},0, ${(v * s + v - v * s) * 255})`;
        }
        else if (h < 360) {
            return `rgb(${(v * s + v - v * s) * 255},0,${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255})`;
        }

        return ''
    }
}

export default CanvasView;
