import CanvasModel from "../Model/canvas.model.js"

class CanvasController {
    _model: CanvasModel;

    constructor(model: CanvasModel) {
        this._model = model;
    }
}

export default CanvasController;