import CanvasModel from "../Model/canvas.model.js"

class CanvasController {
    _model: CanvasModel;

    constructor(model: CanvasModel) {
        this._model = model;
    }

    handleResizeEvent(canvas: HTMLCanvasElement, dx: number, dy: number) {
        let newWidth: number = parseInt(getComputedStyle(canvas, '').width, 10) + 2 * dx;
        let newHeight: number = parseInt(getComputedStyle(canvas, '').height, 10) + dy;

        this._model.changeCanvasParams(newWidth, newHeight);
    }
}

export default CanvasController;