import CanvasView from "../View/canvas.view.js";
class CanvasController {
    constructor(model) {
        this._model = model;
        this._view = new CanvasView(model);
        this._view.handleButtonClick(this.changeCanvasParams.bind(this));
    }
    changeCanvasParams(width, height) {
        console.log("Change");
        this._model.changeCanvasParams(width, height);
        console.log(this._model.width);
    }
}
export default CanvasController;
