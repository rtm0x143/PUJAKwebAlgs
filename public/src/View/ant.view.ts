import CanvasView from './canvas.view.js';
import Errors from "../config/Errors.js";
import GraphModel from "../Model/graph.model.js";

class AntView extends CanvasView {
    //class Objects
    private _graphModel: GraphModel;

    //canvas elements
    private _canvas: HTMLCanvasElement;
    private readonly _context: CanvasRenderingContext2D;

    //button elements
    private _sendButton: HTMLButtonElement;

    constructor(graphModel: GraphModel) {
        super(graphModel);

        this._graphModel = graphModel;

        //canvas elements initialise
        this._canvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        this._context = this._canvas.getContext('2d') ?? Errors.handleError('null');

        //button elements initialise
        this._sendButton = document.querySelector('.ui__calc-button') ?? Errors.handleError('null');

        //subscribe model events
        this._subscribe();

        //initialise canvas size params
        this._canvas.height = 800;
        this._canvas.width = 1200;
    }

    /**
     * this handler method used for listen mouseEvent and call function that set mouseEvent coordinates to model
     *
     * @param callback - Function
     */
    setCoordsHandler(callback: Function) {
        this._canvas.addEventListener('click', (e) => {
            callback(e.offsetX, e.offsetY);
        })
    }

    /**
     * this handler method used to call function that count distances in model
     *
     * @param tokenCallback
     * @param dataCallback
     */
    getDataHandler(tokenCallback: Function, dataCallback: Function) {
        this._sendButton.addEventListener('click', () => {
            tokenCallback();
        })
    }


    //subscribe dispatching events
    _subscribe() {
        this._graphModel.addEventListener('canvas:change', () => {
            console.log(this._graphModel.coords);
            this.drawCircle
            (
                this._context,
                '',
                'white',
                this._graphModel.coords[this._graphModel.coords.length - 2],
                this._graphModel.coords[this._graphModel.coords.length - 1],
                5
            );
        })
    }
}

export default AntView;