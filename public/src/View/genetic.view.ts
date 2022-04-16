import GraphView from './graph.view.js';
import Errors from "../config/Errors.js";
import GraphModel from "../Model/graph.model.js";

class GeneticView extends GraphView {

    //button elements
    private _launchButton: HTMLButtonElement;

    constructor(graphModel: GraphModel) {
        super(graphModel);

        //button elements initialise
        this._launchButton = document.querySelector('.ui__calc-button[name=launch]') ?? Errors.handleError('null');
        this.clearButton = document.querySelector('.ui__clear-canvas') ?? Errors.handleError('null');

        //subscribe model events
        this._subscribe();

        //initialise canvas size params;
        this.canvas.height = +this.canvasWrapper.offsetHeight;
        this.canvas.width = +this.canvasWrapper.offsetWidth;
    }

    /**
     * this handler method used for listen mouseEvent and call function that set mouseEvent coordinates to model
     *
     * @param callback - Function
     */
    setCoordsHandler(callback: Function) {
        this.canvas.addEventListener('click', (e) => {
            callback(e.offsetX, e.offsetY);
        })
    }

    /**
     * this handler method used to call function that count distances in model
     *
     * @param callback - Function
     */
    launchAlgHandler(tokenCallback: Function) {
        this._launchButton.addEventListener('click', async () => {
            tokenCallback();
        })
    }
}

export default GeneticView;
