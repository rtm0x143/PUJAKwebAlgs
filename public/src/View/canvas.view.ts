import { collapseTextChangeRangesAcrossMultipleVersions, isThisTypeNode } from 'typescript';
import Errors from '../config/Errors.js';
import CanvasModel from '../Model/canvas.model.js';

class CanvasView {
    private _canvasModel: CanvasModel;

    public canvas: HTMLCanvasElement; 
    public canvasWrapper: HTMLDivElement;
    public resizeIcon: HTMLDivElement;

    private _isDrawing = false;

    constructor(model: CanvasModel) {
        this.resizeIcon = document.querySelector('.resize-icon') ?? Errors.handleError('null');
        this.canvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        this.canvasWrapper = document.querySelector('.canvas') ?? Errors.handleError('null');
        this._canvasModel = model;

        this._subscribeToCanvasModel();
    }

    //#region handleMouse methods (doensn't work)
    handleMouseDownResize(callback: Function): void {
        this.resizeIcon.addEventListener('mousedown', (e: MouseEvent) => {
            e.preventDefault();

            callback(e);
        });
    }

    handleMouseMoveResize(callback: Function): void {
        document.addEventListener('mousemove', (e: MouseEvent) => {
            e.preventDefault();

            callback(this.canvasWrapper, e);
        });
    }

    handleMouseUpResize(callback: Function): void {
        document.addEventListener('mouseup', () => {
            callback();
        });
    } 
    //#endregion

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
            this.canvasWrapper.style.width = this._canvasModel.width.toString() + "px";
            this.canvasWrapper.style.height = this._canvasModel.height.toString() + "px";
            this.canvas.width = this._canvasModel.width;
            this.canvas.height = this._canvasModel.height;
            this.drawGrid(this.canvas, this.canvas.getContext('2d') ?? Errors.handleError("null"), 'grey', Math.floor(this.canvas.width / 30), Math.floor(this.canvas.height / 30));
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
