import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';
import ClasterModel from '../Model/claster.model.js';
import View from './View.js';

class CanvasClasterView extends View {
    // private _body: HTMLBodyElement;
    private _canvas: HTMLCanvasElement;
    private _canvasContext: CanvasRenderingContext2D;

    private _regulatorButton: HTMLButtonElement;
    // private _regulator: HTMLDivElement;

    // private _rangeInput: HTMLInputElement;
    // private _groupInput: HTMLInputElement;

    // private _DBSCANButton: HTMLButtonElement;
    // private _Kmeansutton: HTMLButtonElement;

    private _clasterModel: ClasterModel;
    //private _brush: Brush;

    constructor(model: ClasterModel) {
        super(document.querySelector('body') ?? Errors.handleError('null'),
                document.querySelector('.regulator__button') ?? Errors.handleError('null'),
                document.querySelector('.regulator__width-param') ?? Errors.handleError('null'));

        //Canvas element and context
        this._canvas = document.querySelector('.ui canvas') ?? Errors.handleError('null');
        this._canvasContext = this._canvas.getContext('2d') ?? Errors.handleError('null');

        //Elements fo change canvas
        this._regulatorButton = document.querySelector('.regulator__button') ?? Errors.handleError('null');

        //server data
        // this._rangeInput = document.querySelector('.range') ?? Errors.handleError('null');
        // this._groupInput = document.querySelector('.groupsize') ?? Errors.handleError('null');

        // //buttons to send on server ddata
        // this._DBSCANButton = document.querySelector('.DBSCAN') ?? Errors.handleError('null');
        // this._Kmeansutton = document.querySelector('.kmeans') ?? Errors.handleError('null');

        //Models
        this._clasterModel = model;
        //this._brush = new Brush();    add Brush
        //this._subscribe();
    }

    getMousePosition(event: MouseEvent): Object {
        return {
            x: event.clientX - this._canvas.offsetLeft,
            y: event.clientY - this._canvas.offsetTop
        }
    }

    changeCanvasView(strokeColor: string, fillColor: string, x: number, y: number, i: number) {
        this.drawCircle(
            this._canvasContext,
            strokeColor,
            fillColor,
            x,
            y,
            5
        )
    }

    _subscribe() {
        this._clasterModel.addEventListener('claster.model:addObj', () => this.changeCanvasView('',
            'red', 
            this._clasterModel.positions[this._clasterModel.positions.length - 1],
            this._clasterModel.positions[this._clasterModel.positions.length - 2],
            0
        ));
    }

    handleButtonClick(callback: Function) {
        return this._canvas.addEventListener('click', (event) => {
            event.preventDefault();
            callback(this.getMousePosition(event));
        });
    }

    handleDBSCANFetch(callback: Function) {
        this._DBSCANButton.addEventListener('click', (event) => {
            event.preventDefault();
            callback(parseInt(this._rangeInput.value), parseInt(this._groupInput.value));
        })
    }    

    handleKMeansFetch(callback: Function) {
        this._Kmeansutton.addEventListener('click', (event) => {
            event.preventDefault();
            callback()
        })
    }   
}

export default CanvasClasterView;
