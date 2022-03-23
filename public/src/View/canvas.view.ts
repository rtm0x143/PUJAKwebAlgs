import Errors from '../config/Errors.js';
import CanvasModel from '../Model/canvas.model.js';
import Brush from '../Model/brush.model.js';

class CanvasView {
    public _canvas: HTMLCanvasElement;
    private _widthInput: HTMLInputElement;
    private _heightInput: HTMLInputElement;
    private _button: HTMLInputElement;
    private _canvasModel: CanvasModel;
    private _brush: Brush;
    
    constructor(model: CanvasModel) {
        this._canvas = document.querySelector('.canvas') ?? Errors.handleError('null');
        this._widthInput = document.querySelector('.canvasWidth') ?? Errors.handleError('null');
        this._heightInput = document.querySelector('.canvasHeight') ?? Errors.handleError('null');
        this._button = document.querySelector('.sendButton') ?? Errors.handleError('null');
        this._brush = new Brush();
        this._canvasModel = model;
        this._subscribe();
    }

    changeCanvas() {
        this._canvas.width = this._canvasModel.width > 0 ? this._canvasModel.width : this._canvas.width;
        this._canvas.height = this._canvasModel.height > 0 ? this._canvasModel.height : this._canvas.height;
    }

    _subscribe() {
        this._canvasModel.addEventListener('canvas.model:change', () => this.changeCanvas());
    }

    handleButtonClick(callback: Function) {
        return this._button.addEventListener('click', (event) => {
            event.preventDefault();
            console.log(event);
            callback(parseInt(this._widthInput.value), parseInt(this._heightInput.value));
        });

    }
}

export default CanvasView;

// Почему???