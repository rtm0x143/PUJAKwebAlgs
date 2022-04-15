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

        //subscribe model events
        this._subscribe();

        //initialise canvas size params
        this.canvas.height = 800;
        this.canvas.width = 1200;
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

    //subscribe dispatching events
    // _subscribe() {
    //     this._graphModel.addEventListener('canvas:change', () => {
    //         console.log(this._graphModel.coords);
    //         this.drawCircle
    //         (
    //             '',
    //             'white',
    //             {
    //                 x: this._graphModel.coords[this._graphModel.coords.length - 2],
    //                 y: this._graphModel.coords[this._graphModel.coords.length - 1],
    //             },
    //             5
    //         );
    //     })
    // }
}

export default GeneticView;