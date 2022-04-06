import CanvasView from './canvas.view';
import GraphModel from '../Model/graph.model'
import Errors from "../config/Errors";

class GraphView extends CanvasView {
    private _canvas: HTMLCanvasElement;
    private _sendButton: HTMLButtonElement;

    constructor(model: GraphModel) {
        super(model);

        this._canvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        this._sendButton = document.querySelector('.calcButton') ?? Errors.handleError('null');
    }

    setCoordsHandler(callback: Function) {
        this._canvas.addEventListener('click', (e) => {
            callback(e.clientX, e.clientY);
        })
    }

    calcHandler(callback: Function) {
        this._sendButton.addEventListener('click', () => {
            callback();
        })
    }
}

export default GraphView;