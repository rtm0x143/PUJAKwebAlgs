import Errors from '../config/Errors.js';
import CanvasModel from '../Model/canvas.model.js';
import CanvasView from "./canvas.view.js";
import Brush from '../Model/brush.model.js';

class CanvasAstarView extends CanvasView {
    private _gridSizeXInput: number;
    private _gridSizeYInput: number;
    //private _drawGridButton: HTMLInputElement;
    
    get gridSizeX(): number {
        return this._gridSizeXInput;
    }
    set gridSizeX(value: number) {
        this._gridSizeXInput = value;
    }

    get gridSizeY(): number {
        return this._gridSizeYInput;
    }
    set gridSizeY(value: number) {
        this._gridSizeYInput = value;
    }

    // canvasModel необходимо будет удалить
    constructor(canvasModel: CanvasModel) {
        super(canvasModel);
        this._gridSizeXInput = 10; //document.querySelector('.gridX') ?? Errors.handleError("null");
        this._gridSizeYInput = 15; //document.querySelector('.gridY') ?? Errors.handleError("null");
        //this._drawGridButton = document.querySelector('.gridButton') ?? Errors.handleError("null");
    }

    // handleButtonClick(callback: Function) {
    //     return this._drawGridButton.addEventListener('click', (event) => {
    //         event.preventDefault();
    //         callback(this.gridSizeX, this.gridSizeY);
    //     });
    // }

    // Сделать вектор (Виктор) 
    drawGrid() {
        let canvasContext = this._canvas.getContext('2d') ?? Errors.handleError("null");
        let xSegment: number = this._canvas.width / this.gridSizeX;
        let ySegment: number = this._canvas.height / this.gridSizeY;

        for (let i = 0; i < this.gridSizeX; i++) {
            canvasContext?.moveTo(i * xSegment, 0);
            canvasContext?.lineTo(i * xSegment, this._canvas.height);
        }

        for (let i = 0; i < this.gridSizeY; i++) {
            canvasContext?.moveTo(0, i * ySegment);
            canvasContext?.lineTo(this._canvas.width, i * ySegment);
        }
    }
}

export default CanvasAstarView;