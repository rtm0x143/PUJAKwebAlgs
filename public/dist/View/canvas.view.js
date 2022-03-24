import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';
class CanvasView {
    constructor(model) {
        var _a, _b, _c, _d;
        this._canvas = (_a = document.querySelector('.canvas')) !== null && _a !== void 0 ? _a : Errors.handleError('null');
        this._widthInput = (_b = document.querySelector('.canvasWidth')) !== null && _b !== void 0 ? _b : Errors.handleError('null');
        this._heightInput = (_c = document.querySelector('.canvasHeight')) !== null && _c !== void 0 ? _c : Errors.handleError('null');
        this._button = (_d = document.querySelector('.sendButton')) !== null && _d !== void 0 ? _d : Errors.handleError('null');
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
    handleButtonClick(callback) {
        return this._button.addEventListener('click', (event) => {
            event.preventDefault();
            console.log(event);
            callback(parseInt(this._widthInput.value), parseInt(this._heightInput.value));
        });
    }
}
export default CanvasView;
// Почему???
