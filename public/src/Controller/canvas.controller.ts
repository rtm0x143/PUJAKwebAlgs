import CanvasModel from "../Model/canvas.model.js"
import CanvasView from "../View/canvas.view.js";

class CanvasController {
    _model: CanvasModel;
    _view: CanvasView;

    constructor(model: CanvasModel) {
        this._model = model;
        this._view = new CanvasView();
    }
}

export default CanvasController;