import CanvasModel from "../Model/canvas.model.js"
import CanvasView from "../View/canvas.view";

class CanvasController {
    _model: CanvasModel;
    _view: CanvasView;

    constructor(model: CanvasModel) {
        this._model = model;
        this._view = new CanvasView(model);
        
        this._view.handleResizeEvent(this.resizeEventCallback);
    }

    resizeEventCallback(canvas: HTMLCanvasElement, dx: number, dy: number) {
        let newWidth: number = parseInt(getComputedStyle(canvas, '').width, 10) + 2 * dx;
        let newHeight: number = parseInt(getComputedStyle(canvas, '').height, 10) + dy;

        this._model.changeCanvasParams(newWidth, newHeight);
    }
}

export default CanvasController;