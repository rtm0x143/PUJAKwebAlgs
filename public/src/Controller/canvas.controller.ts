import { isJSDocThisTag } from "typescript";
import CanvasModel from "../Model/canvas.model.js"
import CanvasView from "../View/canvas.view.js";

class CanvasController {
    private _mousePosX = 0;
    private _mousePosY = 0;
    private _model: CanvasModel;
    private _view: CanvasView;
    private _isResizing: Boolean;

    public urlValue: string = location.origin;

    constructor(model: CanvasModel) {
        this._model = model;
        this._view = new CanvasView(model);
        this._isResizing = false;

        this._view.handleMouseDownResize((e: MouseEvent) => this.mouseDownCallback(e));

        this._view.handleMouseMoveResize((canvasWrapper: HTMLDivElement, e: MouseEvent) => {
            this.mouseMoveCallback(canvasWrapper, e);
        });

        this._view.handleMouseUpResize(() => this.mouseUpCallback());
        
        // this._view.handleResizeEvent(this.resizeEventCallback.bind(this));
    }

    //#region mouse methods callbacks
    mouseDownCallback(e: MouseEvent) {
        this._isResizing = true;
        this._mousePosX = e.clientX;
        this._mousePosY = e.clientY;
    }

    mouseMoveCallback(canvasWrapper: HTMLDivElement, e: MouseEvent) {
        if (this._isResizing) {
            let dx = e.clientX - this._mousePosX;
            let dy = e.clientY - this._mousePosY;
    
            this._mousePosX = e.clientX;
            this._mousePosY = e.clientY;
            
            let newWidth: number = parseInt(getComputedStyle(canvasWrapper, '').width, 10) + 2 * dx;
            let newHeight: number = parseInt(getComputedStyle(canvasWrapper, '').height, 10) + 2 * dy;            
    
            this._model.changeCanvasParams(newWidth, newHeight);
        }        
    }

    mouseUpCallback() {
        this._isResizing = false;
    }
    //#endregion
   
    // resizeEventCallback(canvasWrapper: HTMLDivElement, dx: number, dy: number) {
    //     let newWidth: number = parseInt(getComputedStyle(canvasWrapper, '').width, 10) + 2 * dx;
    //     let newHeight: number = parseInt(getComputedStyle(canvasWrapper, '').height, 10) + 2 * dy;

    //     this._model.changeCanvasParams(newWidth, newHeight);
    // }
}

export default CanvasController;