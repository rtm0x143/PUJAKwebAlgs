import CanvasModel from "../Model/canvas.model.js"
import CanvasView from "../View/canvas.view.js";

class CanvasController {
    private _model: CanvasModel;
    private _view: CanvasView;

    public _mousePosX = 0;
    public _mousePosY = 0;
    public urlValue: string = location.origin;

    constructor(model: CanvasModel) {
        this._model = model;
        this._view = new CanvasView(model);

        this._view.handleResize((e: MouseEvent) => {
            this.mouseDownCallback(e)
        }, (e: MouseEvent) => {
            this.mouseMoveCallback(e);
        });
    }

    mouseDownCallback(e: MouseEvent) {
        this._mousePosX = e.clientX;
        this._mousePosY = e.clientY;
    }

    mouseMoveCallback(e: MouseEvent) {
        let dx = e.clientX - this._mousePosX;
        let dy = e.clientY - this._mousePosY;

        this._mousePosX = e.clientX;
        this._mousePosY = e.clientY;
        
        let newWidth: number = parseInt(getComputedStyle(this._view.canvasWrapper, '').width, 10) + 2 * dx;
        let newHeight: number = parseInt(getComputedStyle(this._view.canvasWrapper, '').height, 10) + 2 * dy;            

        this._model.changeCanvasParams(newWidth, newHeight);   
    }
}

export default CanvasController;
