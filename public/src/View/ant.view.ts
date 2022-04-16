import GraphView from "../View/graph.view.js"
import Errors from "../config/Errors.js";
import GraphModel from "../Model/graph.model.js";

class AntView extends GraphView {
    //button elements
    private _launchButton: HTMLButtonElement;
    private _countInput: HTMLInputElement;
    private _influenceInput: HTMLInputElement;
    private _desirabilityInput: HTMLInputElement;
    private _leekInput: HTMLInputElement;

    constructor(graphModel: GraphModel) {
        super(graphModel);

        //button elements initialise
        this._launchButton = document.querySelector('.ui__calc-button[name=launch]')
            ?? Errors.handleError('null');

        this._countInput = document.querySelector('.ui__count-button')
            ?? Errors.handleError('null');
        this._influenceInput = document.querySelector('.ui__influence-button')
            ?? Errors.handleError('null');
        this._desirabilityInput = document.querySelector('.ui__desirability-button')
            ?? Errors.handleError('null');
        this._leekInput = document.querySelector('.ui__leek-button')
            ?? Errors.handleError('null');

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
            tokenCallback({
                antsCount: this._countInput.value,
                greedCoef: this._influenceInput.value,
                herdCoef: this._desirabilityInput.value,
                pherLeak: this._leekInput.value
            });
        })
    }
}

export default AntView;