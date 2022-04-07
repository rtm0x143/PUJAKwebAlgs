import Errors from "../config/Errors.js";
import NeuralModel from '../Model/neural.model.js';
import canvasView from './canvas.view.js';

class NeuralView extends canvasView {
    private _neuralModel: NeuralModel;

    // canvas elements
    private readonly _neuralCanvas: HTMLCanvasElement;
    private _neuralData: HTMLCanvasElement;

    // context elements
    private _neuralContext: CanvasRenderingContext2D;
    private _dataContext: CanvasRenderingContext2D;

    // button elements
    private _sendButton: HTMLButtonElement;
    private _clearButton: HTMLButtonElement;

    private _answerParagraph: HTMLParagraphElement;

    constructor(neuralModel: NeuralModel) {
        super(neuralModel);

        this._neuralModel = neuralModel;

        // canvas elements initialise
        this._neuralCanvas = document.querySelector('.canvas__element')
            ?? Errors.handleError('null');
        this._neuralData = document.querySelector('.ui__canvas-data')
            ?? Errors.handleError('null');

        // button elements initialise
        this._sendButton = document.querySelector('.send-button')
            ?? Errors.handleError('null');
        this._clearButton = document.querySelector('.clear-button')
            ?? Errors.handleError('null');

        // contexts
        this._neuralContext = this._neuralCanvas.getContext('2d')
            ?? Errors.handleError('null');
        this._dataContext = this._neuralData.getContext('2d')
            ?? Errors.handleError('null');

        this._answerParagraph = document.querySelector('.answer-paragraph')
            ?? Errors.handleError('null');

        // subscribe to model events
        this._subscribe();

        // initialise canvas params
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

            let obj = this._neuralModel.getSource(this._neuralContext.getImageData(
                0, 0, this._neuralCanvas.width, this._neuralCanvas.height))

            console.log(obj.sX, obj.sWidth);
            console.log(obj.sY, obj.sHeight);

            this._dataContext.drawImage(
                this._neuralCanvas,
                obj.sX,
                obj.sY,
                obj.sWidth,
                obj.sHeight,
                0,
                0,
                50,
                50
            )

            callback(this._dataContext.getImageData(0, 0, 50, 50));
        })
    }

    /**
     * function used for clear canvas
     *
     * @param callback - Function from controller
     */
    clearHandler(callback: Function): void {
        this._clearButton.addEventListener('click', (e: MouseEvent) => {
            e.preventDefault();

            callback();
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
        })

        this._neuralModel.addEventListener('answer:change', _ => {
            this._answerParagraph.innerHTML = this._neuralModel.answer;
        })

        this._neuralModel.addEventListener('canvas:clear', _ => {
            this._neuralContext.clearRect(0, 0, this._neuralCanvas.width, this._neuralCanvas.height);
            this._dataContext.clearRect(0, 0, this._neuralData.width, this._neuralData.height);
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