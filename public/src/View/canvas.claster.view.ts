import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';
import ClasterModel from '../Model/claster.model.js';
import View from './View.js';

class CanvasClasterView extends View {
    // private _body: HTMLBodyElement;
    private _canvasContext: CanvasRenderingContext2D;

    private _regulatorButton: HTMLButtonElement;
    // private _regulator: HTMLDivElement;

    // private _rangeInput: HTMLInputElement;
    // private _groupInput: HTMLInputElement;

    private _DBSCANButton: HTMLButtonElement;
    private _Kmeansutton: HTMLButtonElement;

    private _clasterModel: ClasterModel;
    //private _brush: Brush;

    constructor(model: ClasterModel) {
        super(document.querySelector('body') ?? Errors.handleError('null'),
                document.querySelector('.regulator__button') ?? Errors.handleError('null'),
                document.querySelector('.regulator__width-param') ?? Errors.handleError('null'),
                document.querySelector('.regulator__bar') ?? Errors.handleError('null'),
                document.querySelector('.canvas') ?? Errors.handleError('null'),
                document.querySelector('.canvas__element') ?? Errors.handleError('null'),
                document.querySelector('.regulator__height-paragraph') ?? Errors.handleError('null'));

        //Canvas element and context
        this._canvasContext = this.canvas.getContext('2d') ?? Errors.handleError('null');

        //Elements fo change canvas
        this._regulatorButton = document.querySelector('.regulator__button') ?? Errors.handleError('null');

        //server data
        // this._rangeInput = document.querySelector('.range') ?? Errors.handleError('null');
        // this._groupInput = document.querySelector('.groupsize') ?? Errors.handleError('null');

        // //buttons to send on server ddata
        this._DBSCANButton = document.querySelector('.canvas__menu-button_DBSCAN') ?? Errors.handleError('null');
        this._Kmeansutton = document.querySelector('.canvas__menu-button_kmeans') ?? Errors.handleError('null');

        //Models
        this._clasterModel = model;
        //this._brush = new Brush();    add Brush
        this._subscribe();
        this.canvas.setAttribute('height', this.canvasDiv.offsetHeight.toString());
        this.canvas.setAttribute('width', this.canvasDiv.offsetWidth.toString());
    }

    getMousePosition(event: MouseEvent): Object {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    handleButtonClick(callback: Function) {
        return this.canvas.addEventListener('click', (event) => {
            event.preventDefault();
            callback(this.getMousePosition(event));
        });
    }

    _subscribe() {
        this._clasterModel.addEventListener('claster.model:addObj', () => {
            this.drawCircle(
                this._canvasContext,
                '',
                'red', 
                this._clasterModel.positions[this._clasterModel.positions.length - 1],
                this._clasterModel.positions[this._clasterModel.positions.length - 2],
                5
        )});
    }

    handleDBSCANFetch(callback: Function) {
        this._DBSCANButton.addEventListener('click', (event) => {
            event.preventDefault();
            callback(this._canvasContext, parseInt("30"), parseInt("3"));
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
