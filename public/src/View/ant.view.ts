import CanvasView from './canvas.view.js';
import Errors from "../config/Errors.js";
import GraphModel from "../Model/graph.model.js";
import ts from "typescript/lib/tsserverlibrary";
import emptyArray = ts.server.emptyArray;

class AntView extends CanvasView {
    //class Objects
    private _graphModel: GraphModel;

    //canvas elements
    // private _canvas: HTMLCanvasElement;
    // private readonly _context: CanvasRenderingContext2D;

    //button elements
    private _launchButton: HTMLButtonElement;

    constructor(graphModel: GraphModel) {
        super(graphModel);

        this._graphModel = graphModel;

        //canvas elements initialise
        // this._canvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        // this._context = this._canvas.getContext('2d') ?? Errors.handleError('null');

        //button elements initialise
        this._launchButton = document.querySelector('.ui__calc-button[name=launch]') ?? Errors.handleError('null');

        //subscribe model events
        this._subscribe();

        //initialise canvas size params
        // this._canvas.height = 800;
        // this._canvas.width = 1200;
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
            this.drawCircle
            (
                this.canvasContext,
                '',
                'white',
                this._graphModel.coords[this._graphModel.coords.length - 2],
                this._graphModel.coords[this._graphModel.coords.length - 1],
                5
            );
        })

        this._graphModel.addEventListener('way:change', () => {
            
            for (let i = 1; i < this._graphModel.coords.length / 2 + 2; ++i) {
                this.drawLine(
                    this._graphModel.coords[this._graphModel.currentWay[i - 1] * 2],
                    this._graphModel.coords[this._graphModel.currentWay[i - 1] * 2 + 1],
                    this._graphModel.coords[this._graphModel.currentWay[i] * 2],
                    this._graphModel.coords[this._graphModel.currentWay[i] * 2 + 1],
                    10
                );
                console.log(this._graphModel.coords[this._graphModel.currentWay[i - 1] * 2],
                        this._graphModel.coords[this._graphModel.currentWay[i - 1] * 2 + 1],
                        this._graphModel.coords[this._graphModel.currentWay[i] * 2],
                        this._graphModel.coords[this._graphModel.currentWay[i] * 2 + 1],);
            }

            console.log(this._graphModel.currentWay);
        })

        //event for clear canvas
        this._graphModel.addEventListener('canvas:clear', _ => {
            this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
        })

        this._graphModel.addEventListener('draw:circles', () => {
            for (let i = 1; i < this._graphModel.coords.length; i += 2) {
                this.drawCircle
                (
                    this.canvasContext,
                    '',
                    'white',
                    this._graphModel.coords[i - 1],
                    this._graphModel.coords[i],
                    5
                );
            }
        })
    }

    /**
     * @param x1 - the pos x of first Point
     * @param y1 - the pos y of first Point
     * @param x2 - the pos x of second Point
     * @param y2 - the pos y of second Point
     * @param width - width for line
     */
    drawLine(x1: number, y1: number, x2: number, y2: number, width: number): void {
        this.canvasContext.shadowBlur = 10;
        this.canvasContext.shadowColor = "#fff";
        this.canvasContext.shadowOffsetX = -1000;
        this.canvasContext.beginPath();
        this.canvasContext.strokeStyle = 'white';
        
        console.log("style", this.canvasContext.strokeStyle);
        
        this.canvasContext.lineWidth = width;
        this.canvasContext.moveTo(x1, y1);
        this.canvasContext.lineTo(x2, y2);
        this.canvasContext.stroke();
        this.canvasContext.closePath();
    }
}

export default AntView;