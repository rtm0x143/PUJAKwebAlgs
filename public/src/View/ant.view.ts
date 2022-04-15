import GraphView from "../View/graph.view.js"
import Errors from "../config/Errors.js";
import GraphModel from "../Model/graph.model.js";

class AntView extends GraphView {
    //button elements
    private _launchButton: HTMLButtonElement;

    constructor(graphModel: GraphModel) {
        super(graphModel);

        //button elements initialise
        this._launchButton = document.querySelector('.ui__calc-button[name=launch]') ?? Errors.handleError('null');

        //initialise canvas size params]
        this.canvas.height = 800;
        this.canvas.width = 1200;
    }

     /**
     * this handler method used to call function that count distances in model
     *
     * @param tokenCallback
     */
    launchAlgHandler(tokenCallback: Function) {
        this._launchButton.addEventListener('click', async () => {
            tokenCallback();
        })
    }
}

export default AntView;