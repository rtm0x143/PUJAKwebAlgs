import CanvasView from './canvas.view.js';
import Errors from "../config/Errors.js";
import GraphModel from "../Model/graph.model.js";
import ts from "typescript/lib/tsserverlibrary";
import emptyArray = ts.server.emptyArray;

class AntView extends CanvasView {
    //class Objects
    private _graphModel: GraphModel;

    //button elements
    private _launchButton: HTMLButtonElement;

    constructor(graphModel: GraphModel) {
        super(graphModel);

        this._graphModel = graphModel;

        //button elements initialise
        this._launchButton = document.querySelector('.ui__calc-button[name=launch]') ?? Errors.handleError('null');

        //subscribe model events
        this._subscribe();

        //initialise canvas size params]
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
     * @param tokenCallback
     */
    launchAlgHandler(tokenCallback: Function) {
        this._launchButton.addEventListener('click', async () => {
            tokenCallback();
        })
    }


    //subscribe dispatching events
    _subscribe() {
        this._graphModel.addEventListener('canvas:change', () => {
            this.drawCircle(
                '',
                'red',
                {
                    x: this._graphModel.coords[this._graphModel.coords.length - 2],
                    y: this._graphModel.coords[this._graphModel.coords.length - 1]
                },
                5
            );
        })

        this._graphModel.addEventListener('way:change', () => {
            
            for (let i = 1; i < this._graphModel.coords.length / 2 + 2; ++i) {
                let p1 = {
                    x: this._graphModel.coords[this._graphModel.currentWay[i - 1] * 2],
                    y: this._graphModel.coords[this._graphModel.currentWay[i - 1] * 2 + 1]
                }
                let p2 = {
                    x: this._graphModel.coords[this._graphModel.currentWay[i] * 2],
                    y: this._graphModel.coords[this._graphModel.currentWay[i] * 2 + 1],
                }

                this.drawLine(p1, p2, 10);
            }

            // console.log(this._graphModel.currentWay);
        })

        //event for clear canvas
        // this._graphModel.addEventListener('canvas:clear', _ => {
        //     this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        // })

        // this._graphModel.addEventListener('draw:circles', () => {
        //     for (let i = 1; i < this._graphModel.coords.length; i += 2) {
        //         this.drawCircle
        //         (
        //             this.canvasContext,
        //             '',
        //             "ffffff",
        //             this._graphModel.coords[i - 1],
        //             this._graphModel.coords[i],
        //             5
        //         );
        //     }
        // })
    }
}

export default AntView;