import CanvasView from './canvas.view.js';
import Errors from "../config/Errors.js";
import GraphModel from "../Model/graph.model.js";

class GraphView extends CanvasView {
    //class Objects
    private _graphModel: GraphModel;
    private _graphWayCost: HTMLParagraphElement;

    constructor(graphModel: GraphModel) {
        super(graphModel);

        this._graphModel = graphModel;
        this._graphWayCost = document.querySelector('.way-result-paragraph')
            ?? Errors.handleError('null');

        //subscribe model events
        this._subscribe();
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

    //subscribe dispatching events
    _subscribe() {
        this._graphModel.addEventListener('canvas:change', () => {
            this.drawCircle(
                '#CVCVCV',
                "#ffffff",
                {
                    x: this._graphModel.coords[this._graphModel.coords.length - 2],
                    y: this._graphModel.coords[this._graphModel.coords.length - 1]
                },
                10
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
                this._graphModel.dispatchEvent(new Event('draw:circles'))
            }

            let cost = this._graphModel.cost;
            this._graphModel.setCosts(cost);
            this._graphWayCost.innerHTML = `Best Way ${cost.toFixed(2)}`;
        })

        this._graphModel.addEventListener('add:costs', () => {
            for (let i = 0; i < 3; ++i) {
                if (this._graphModel.costs[i]) {
                    console.log(this._graphModel.costs[i]);
                }
            }
        })

        //event for clear canvas
        this._graphModel.addEventListener('canvas:clear', _ => {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
            // this._canvasModel.dispatchEvent(new Event('draw:circles'));
        })

        this._graphModel.addEventListener('draw:circles', () => {
            for (let i = 1; i < this._graphModel.coords.length; i += 2) {
                this.drawCircle(
                    '#CVCVCV',
                    "#ffffff",
                    {
                        x: this._graphModel.coords[i - 1],
                        y: this._graphModel.coords[i]
                    },
                    10
                );
            }
        })
    }
}

export default GraphView;