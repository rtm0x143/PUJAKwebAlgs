import Errors from "../config/Errors.js";
import NeuralModel from '../Model/neural.model.js';
import CanvasView from './canvas.view.js';

class NeuralView extends CanvasView {
    private _neuralModel: NeuralModel;

    // canvas elements
    // private readonly _neuralCanvas: HTMLCanvasElement;
    private _neuralData: HTMLCanvasElement;

    // context elements
    private _neuralContext: CanvasRenderingContext2D;
    private _dataContext: CanvasRenderingContext2D;

    // button elements
    private _sendButton: HTMLButtonElement;

    constructor(neuralModel: NeuralModel) {
        super(neuralModel);

        this._neuralModel = neuralModel;

        // canvas elements initialise
        this._neuralData = document.querySelector('.ui__canvas-data') ?? Errors.handleError('null');

        // button elements initialise
        this._sendButton = document.querySelector('.send-button') ?? Errors.handleError('null');

        // contexts
        this._neuralContext = this.canvas.getContext('2d') ?? Errors.handleError('null');
        this._dataContext = this._neuralData.getContext('2d') ?? Errors.handleError('null');

        // subscribe to model events
        this._subscribe();

        // initialise canvas params
        this.canvas.height = 600;
        this.canvas.width = 600;
    }

    /**
     * call function after mousedown event, which will start drawing
     *
     * @param callback - Function from controller
     */
    mouseDownHandler(callback: Function): void {
        this.canvas.addEventListener('mousedown', (e) => {
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
        this.canvas.addEventListener('mousemove', (e) => {
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

            callback();
        })
    }

    /**
     * function after mouseclick event, which send data to server
     *
     * @param callback - Function from controller
     */
   sendButtonHandler(callback: Function): void {
        this._sendButton.addEventListener('click', (e) => {
            e.preventDefault();

            callback(this._dataContext.getImageData(0, 0, 50, 50));
        })
    }

    /**
     * registry listeners for model events
     */
    private _subscribe(): void {
        this._neuralModel.addEventListener('neuralcoordschange', _ => {
            if (this._neuralModel.coords.length > 1) {
                this.drawLine(
                    this._neuralModel.coords[this._neuralModel.coords.length - 4],
                    this._neuralModel.coords[this._neuralModel.coords.length - 3],
                    this._neuralModel.coords[this._neuralModel.coords.length - 2],
                    this._neuralModel.coords[this._neuralModel.coords.length - 1],
                )
            }

            this._dataContext.drawImage(this.canvas, 0, 0, 50, 50)
        })
    }

    /**
     * function that drawLine on canvas
     */
    drawLine(x1: number, y1: number, x2: number, y2: number): void {
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