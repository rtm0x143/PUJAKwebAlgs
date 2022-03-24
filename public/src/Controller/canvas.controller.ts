import CanvasModel from "../Model/canvas.model.js"
import CanvasView from "../View/canvas.view.js";

class CanvasController {
    _model: CanvasModel;
    _view: CanvasView;

    constructor(model: CanvasModel) {
        this._model = model;
        this._view = new CanvasView(model);

        this._view.handleButtonClick(this.changeCanvasParams.bind(this));
    }

    changeCanvasParams(width: number, height: number) {
        console.log("Change");
        this._model.changeCanvasParams(width, height);
        console.log(this._model.width);
    }
}

export default CanvasController;