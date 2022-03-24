import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';
import ClasterModel from '../Model/claster.model.js';

class CanvasClasterView {
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

    changeCanvasView() {
        let x: number = this._clasterModel.positions[this._clasterModel.positions.length - 1];
        let y: number = this._clasterModel.positions[this._clasterModel.positions.length - 2];
        this._canvasContext.strokeStyle = 'blue';
        this._canvasContext.fillStyle = 'red';
        this._canvasContext.beginPath();
        this._canvasContext.arc(x, y, 5, 0, 2 * Math.PI);
        this._canvasContext.stroke();
        this._canvasContext.fill();
    }

    _subscribe() {
        this._clasterModel.addEventListener('claster.model:addObj', () => this.changeCanvasView());
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