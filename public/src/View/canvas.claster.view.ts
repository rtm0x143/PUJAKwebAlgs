import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';
import ClasterModel from '../Model/claster.model.js';
import View from './View.js';

class CanvasClasterView extends View {
    private _canvas: HTMLCanvasElement;
    private _canvasContext: CanvasRenderingContext2D;
    private _button: HTMLInputElement;
    private _DBSCANButton: HTMLButtonElement;
    private _Kmeansutton: HTMLButtonElement;
    private _clasterModel: ClasterModel;
    private _brush: Brush;
    private _rangeInput: HTMLInputElement;
    private _groupInput: HTMLInputElement;
    
    constructor(model: ClasterModel) {
        super();

        this._canvas = document.querySelector('.canvas') ?? Errors.handleError('null');
        this._canvasContext = this._canvas.getContext('2d') ?? Errors.handleError('null');
        this._button = document.querySelector('.sendButton') ?? Errors.handleError('null');
        this._DBSCANButton = document.querySelector('.DBSCAN') ?? Errors.handleError('null');
        this._Kmeansutton = document.querySelector('.kmeans') ?? Errors.handleError('null');
        this._rangeInput = document.querySelector('.range') ?? Errors.handleError('null');
        this._groupInput = document.querySelector('.groupsize') ?? Errors.handleError('null');
        this._clasterModel = model;
        this._brush = new Brush();
        this._subscribe();
    }

    getMousePosition(event: MouseEvent): Object {
        return {
            x: event.clientX - this._canvas.offsetLeft,
            y: event.clientY - this._canvas.offsetTop
        }
    }

    changeCanvasView(strokeColor: string, fillColor: string, x: number, y: number, i: number) {
        console.log({fillColor, x, y, i});
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

// Почему???