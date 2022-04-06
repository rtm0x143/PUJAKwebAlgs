import Errors from "../config/Errors.js";
import NeuralModel from '../Model/neural.model.js';
import canvasView from './canvas.view.js';

class NeuralView extends canvasView {
    private _neuralModel: NeuralModel;
    private readonly _neuralCanvas: HTMLCanvasElement;
    private _neuralData: HTMLCanvasElement;
    private _sendButton: HTMLButtonElement;
    private _neuralContext: CanvasRenderingContext2D;
    private _dataContext: CanvasRenderingContext2D;

    constructor(neuralModel: NeuralModel) {
        super();

        this._neuralModel = neuralModel;
        this._neuralCanvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        this._neuralData = document.querySelector('.ui__canvas-data') ?? Errors.handleError('null');
        this._sendButton = document.querySelector('.send-button') ?? Errors.handleError('null');
        this._neuralContext = this._neuralCanvas.getContext('2d') ?? Errors.handleError('null');
        this._dataContext = this._neuralData.getContext('2d') ?? Errors.handleError('null');
        this._subscribe();
        this._neuralCanvas.height = 600;
        this._neuralCanvas.width = 600;
    }

    /**
     * call function after mousedown event, which will start drawing
     *
     * @param callback - Function from controller
     */
    mouseDownHandler(callback: Function): void {
        this._neuralCanvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            callback(e);
        })
    }

    /**
     * call function after mousemove event, which will draw lines
     *
     * @param callback - Function from controller
     */
    mouseMoveHandler(callback: Function): void {
        this._neuralCanvas.addEventListener('mousemove', (e) => {
            e.preventDefault();
            callback(e);
        })
    }

    /**
     * call function after mouseup event, which disable other mouse events
     *
     * @param callback - Function from controller
     */
    mouseUpHandler(callback: Function): void {
        window.addEventListener('mouseup', (e) => {
            e.preventDefault();
            callback(e);
        })
    }

    /**
     *function after mouseclick event, which send data to server
     *
     * @param callback - Function from controller
     */
   sendButtonHandler(callback: Function): void {
        this._sendButton.addEventListener('click', (e) => {
            console.log(this._dataContext.getImageData(0, 0, 50, 50));
            e.preventDefault();
            callback(this._dataContext.getImageData(0, 0, 50, 50));
        })
    }

    private _subscribe() {
        this._neuralModel.addEventListener('neuralcoordschange', () => {
            if (this._neuralModel.coords.length > 1) {
                this.drawLine(
                    this._neuralModel.coords[this._neuralModel.coords.length - 4],
                    this._neuralModel.coords[this._neuralModel.coords.length - 3],
                    this._neuralModel.coords[this._neuralModel.coords.length - 2],
                    this._neuralModel.coords[this._neuralModel.coords.length - 1],
                )
            }

            this._dataContext.drawImage(this._neuralCanvas, 0, 0, 50, 50)
        })
    }

    /**
     * function that drawLine on canvas
     */
    drawLine(x1: number, y1: number, x2: number, y2: number) {
        this._neuralContext.beginPath();
        this._neuralContext.strokeStyle = 'white';
        this._neuralContext.lineWidth = 15;
        this._neuralContext.moveTo(x1, y1);
        this._neuralContext.lineTo(x2, y2);
        this._neuralContext.stroke();
        this._neuralContext.closePath();
    }
}

export default NeuralView;