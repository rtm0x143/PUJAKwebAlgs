import Model from '../Model/Model.js';
import Controller from '../Controller/Controller.js';
import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';

class View {
    private _regulatorButton: HTMLButtonElement;
    private _widthRegulator: HTMLDivElement;
    private _heightRegulator: HTMLDivElement;
    private _regulatorText: HTMLParagraphElement;
    private _height: number = -60;
    private _currentHeight!: number;
    private _isDown = false;

    constructor() {
        this._regulatorButton = document.querySelector('.regulator__button') ?? Errors.handleError('null')
        this._widthRegulator = document.querySelector('.regulator__width-param') ?? Errors.handleError('null');
        this._heightRegulator = document.querySelector('.regulator__height-param') ?? Errors.handleError('null');
        this._regulatorText = document.querySelector('.regulator__text') ?? Errors.handleError('null');

        this._regulatorButton.addEventListener('mousedown', (e) => {
            this._currentHeight = e.offsetY;
            console.log(this._currentHeight);
            this._isDown = true;
        })

        this._regulatorButton.addEventListener('mousemove', (e) => {
            if (this._isDown) {
                this._height -= Math.abs(this._currentHeight - e.offsetY)
                this._regulatorButton.style.marginTop = `${this._height}px`;
            }
        })

        this._regulatorText.onselectstart = () => {
            return false;
          };

        this._regulatorButton.addEventListener('mouseup', (e) => {
            if (this._isDown) {
                console.log(e.offsetX, e.offsetY);
            }

            this._isDown = false;
        })
    }

    drawCircle(canvasContext: CanvasRenderingContext2D, strokeColor: string, fillColor: string, x: number, y: number, radius: number) {
        canvasContext.strokeStyle = strokeColor;
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
        canvasContext.stroke();
        canvasContext.fill();
    }


}

export default View;