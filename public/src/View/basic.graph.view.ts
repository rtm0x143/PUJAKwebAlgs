import View from './View';
import Errors from "../config/Errors";

class GraphView extends View{
    private _canvas: HTMLCanvasElement;
    private _sendButton: HTMLButtonElement;

    constructor() {
        super();

        this._canvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        this._sendButton = document.querySelector('.calcButton') ?? Errors.handleError('null');
    }

    setCoordsHandler(callback: Function) {
        this._canvas.addEventListener('click', (e) => {
            callback(e.clientX, e.clientY);
        })
    }

    calcHandler(callback: Function) {
        this._sendButton.addEventListener('click', (e) => {
            callback();
        })
    }
}

export default GraphView;