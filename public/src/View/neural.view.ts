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
    private _selectButton: HTMLSelectElement;
    private _sizeInput: HTMLInputElement;
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
        this._selectButton = document.querySelector('.brush-menu__select')
            ?? Errors.handleError('null');
        this._sendButton = document.querySelector('.brush-menu__answer-input')
            ?? Errors.handleError('null');
        this._clearButton = document.querySelector('.brush-menu__clear-input')
            ?? Errors.handleError('null');
        this._sizeInput = document.querySelector('.brush-menu__size-input')
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

    //registry listeners for model events
    private _subscribe(): void {
        this._neuralModel.addEventListener('neuralcoordschange', _ => {
            if (this._neuralModel.coords.length > 1) {
                if (this._selectButton.value === 'circle') {
                    this.drawCircleLine(
                        this._neuralModel.coords[this._neuralModel.coords.length - 4],
                        this._neuralModel.coords[this._neuralModel.coords.length - 3],
                        this._neuralModel.coords[this._neuralModel.coords.length - 2],
                        this._neuralModel.coords[this._neuralModel.coords.length - 1],
                        parseInt(this._sizeInput.value)
                    );
                } else {
                    this.drawLine(
                        this._neuralModel.coords[this._neuralModel.coords.length - 4],
                        this._neuralModel.coords[this._neuralModel.coords.length - 3],
                        this._neuralModel.coords[this._neuralModel.coords.length - 2],
                        this._neuralModel.coords[this._neuralModel.coords.length - 1],
                        parseInt(this._sizeInput.value)
                    );
                }
            }
        })

        //event of answer from neural
        this._neuralModel.addEventListener('answer:change', _ => {
            this._answerParagraph.innerHTML = this._neuralModel.answer;
        })

        //event for clear canvas
        this._neuralModel.addEventListener('canvas:clear', _ => {
            this._neuralContext.clearRect(0, 0, this._neuralCanvas.width, this._neuralCanvas.height);
            this._dataContext.clearRect(0, 0, this._neuralData.width, this._neuralData.height);
        })
    }

    /**
     * @param x1 - the pos x of first Point
     * @param y1 - the pos y of first Point
     * @param x2 - the pos x of second Point
     * @param y2 - the pos y of second Point
     * @param width - width for line
     */
    drawLine(x1: number, y1: number, x2: number, y2: number, width: number): void {
        this._neuralContext.shadowBlur = 10;
        this._neuralContext.shadowColor = "#fff";
        this._neuralContext.shadowOffsetX = -1000;
        this._neuralContext.beginPath();
        this._neuralContext.strokeStyle = 'white';
        this._neuralContext.lineWidth = width;
        this._neuralContext.moveTo(x1, y1);
        this._neuralContext.lineTo(x2, y2);
        this._neuralContext.stroke();
        this._neuralContext.closePath();
    }

    /**
     * function that drawCircle on canvas
     * @param x1 - the pos x of first Point
     * @param y1 - the pos y of first Point
     * @param x2 - the pos x of second Point
     * @param y2 - the pos y of second Point
     * @param radius - radius for circle
     */
    drawCircleLine(x1: number, y1: number, x2: number, y2: number, radius: number): void {
        this._neuralContext.fillStyle = "white";
        this._neuralContext.strokeStyle = "white";
        this._neuralContext.lineWidth = 0;
        this._neuralContext.globalAlpha = Number("1");

        //find distance between two points
        let distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        //find angle of two points
        let angle = Math.atan2( x2 - x1, y2 - y1);

        this._neuralContext.beginPath();

        for (let i = 0; i < distance; ++i) {
            let x = x1 + (Math.sin(angle) * i) - 25;
            let y = y1 + (Math.cos(angle) * i) - 25;
            this._neuralContext.arc(x + 10, y + 10, radius, 0, Math.PI * 2);
        }

        this._neuralContext.fill();
        this._neuralContext.closePath();
    }
}

export default NeuralView;