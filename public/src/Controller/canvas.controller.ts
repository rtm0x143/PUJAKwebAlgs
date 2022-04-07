import CanvasModel from "../Model/canvas.model.js"
import CanvasView from "../View/canvas.view.js";

class CanvasController {
    _model: CanvasModel;
    _view: CanvasView;
    urlValue: string = location.origin;

    constructor(model: CanvasModel) {
        console.log("CanvasController initialized");
        this._model = model;
        this._view = new CanvasView(model);

        this._view.handleResizeEvent(this.resizeEventCallback.bind(this));
    }

    resizeEventCallback(canvasWrapper: HTMLDivElement, dx: number, dy: number) {
        let newWidth: number = parseInt(getComputedStyle(canvasWrapper, '').width, 10) + 2 * dx;
        let newHeight: number = parseInt(getComputedStyle(canvasWrapper, '').height, 10) + dy;

        
        this._model.changeCanvasParams(newWidth, newHeight);
    }


}

export default CanvasController;