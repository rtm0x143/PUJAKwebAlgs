import CanvasModel from "../Model/canvas.model.js"

class CanvasController {
    _model: CanvasModel;

    constructor(model: CanvasModel) {
        this._model = model;
    }

    handleResizeEvent(dx: number, dy: number, canvas: HTMLCanvasElement) {
        canvas.style.width = parseInt(getComputedStyle(canvas, '').width, 10) + 2 * dx + "px";
        canvas.style.height = parseInt(getComputedStyle(canvas, '').height, 10) + 2 * dy + "px";
    }
}

export default CanvasController;