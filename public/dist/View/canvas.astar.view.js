import Errors from '../config/Errors.js';
import CanvasView from "./canvas.view.js";
class CanvasAstarView extends CanvasView {
    // canvasModel необходимо будет удалить
    constructor(canvasModel) {
        super(canvasModel);
        this._gridSizeXInput = 10; //document.querySelector('.gridX') ?? Errors.handleError("null");
        this._gridSizeYInput = 15; //document.querySelector('.gridY') ?? Errors.handleError("null");
        //this._drawGridButton = document.querySelector('.gridButton') ?? Errors.handleError("null");
    }
    //private _drawGridButton: HTMLInputElement;
    get gridSizeX() {
        return this._gridSizeXInput;
    }
    set gridSizeX(value) {
        this._gridSizeXInput = value;
    }
    get gridSizeY() {
        return this._gridSizeYInput;
    }
    set gridSizeY(value) {
        this._gridSizeYInput = value;
    }
    // handleButtonClick(callback: Function) {
    //     return this._drawGridButton.addEventListener('click', (event) => {
    //         event.preventDefault();
    //         callback(this.gridSizeX, this.gridSizeY);
    //     });
    // }
    // Сделать вектор (Виктор) 
    drawGrid() {
        var _a;
        let canvasContext = (_a = this._canvas.getContext('2d')) !== null && _a !== void 0 ? _a : Errors.handleError("null");
        let xSegment = this._canvas.width / this.gridSizeX;
        let ySegment = this._canvas.height / this.gridSizeY;
        for (let i = 0; i < this.gridSizeX; i++) {
            canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.moveTo(i * xSegment, 0);
            canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.lineTo(i * xSegment, this._canvas.height);
        }
        for (let i = 0; i < this.gridSizeY; i++) {
            canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.moveTo(0, i * ySegment);
            canvasContext === null || canvasContext === void 0 ? void 0 : canvasContext.lineTo(this._canvas.width, i * ySegment);
        }
    }
}
export default CanvasAstarView;
