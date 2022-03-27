import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';
import ClasterModel from '../Model/claster.model.js';
import View from './View.js';

class CanvasClasterView extends View {
    private _regulatorButton: HTMLButtonElement;
    // private _regulator: HTMLDivElement;

    // private _rangeInput: HTMLInputElement;
    // private _groupInput: HTMLInputElement;

    private _DBSCANButton: HTMLButtonElement;
    private _Kmeansutton: HTMLButtonElement;

    private _clasterModel: ClasterModel;
    //private _brush: Brush;

    private body: HTMLBodyElement;
    private regulatorButtons: NodeListOf<HTMLButtonElement>;
    private widthRegulator: HTMLDivElement;
    private heightRegulator: HTMLDivElement;
    private heightRegulatorBar: HTMLDivElement;
    private widthRegulatorBar: HTMLDivElement;
    private rangeRegulatorBar: HTMLDivElement;
    private countRegulatorBar: HTMLDivElement;
    private canvasDiv: HTMLDivElement;
    private canvas: HTMLCanvasElement;
    private canvasContext: CanvasRenderingContext2D;
    private heightParagrapth: HTMLParagraphElement;
    private widthParagrapth: HTMLParagraphElement;
    private rangeParagrapth: HTMLParagraphElement;
    private countParagrapth: HTMLParagraphElement;
    private canvasMenu: HTMLDivElement;

    constructor(model: ClasterModel) {
        super();

        this.body = document.querySelector('body') ?? Errors.handleError('null');
        this.regulatorButtons = document.querySelectorAll('.regulator__button') ?? Errors.handleError('null');
        this.heightRegulator = document.querySelector('.regulator__width-param') ?? Errors.handleError('null');
        this.widthRegulator = document.querySelector('.regulator__height-param') ?? Errors.handleError('null');
        this.heightRegulatorBar = document.querySelector('.regulator__bar_height') ?? Errors.handleError('null');
        this.widthRegulatorBar = document.querySelector('.regulator__bar_width') ?? Errors.handleError('null');
        this.rangeRegulatorBar = document.querySelector('.regulator__bar_range') ?? Errors.handleError('null');
        this.countRegulatorBar = document.querySelector('.regulator__bar_count') ?? Errors.handleError('null');
        this.canvasDiv = document.querySelector('.canvas') ?? Errors.handleError('null');
        this.canvas = document.querySelector('.canvas__element') ?? Errors.handleError('null');
        this.canvasContext = this.canvas.getContext('2d') ?? Errors.handleError('null');
        this.heightParagrapth = document.querySelector('.regulator__height-paragraph') ?? Errors.handleError('null');
        this.widthParagrapth = document.querySelector('.regulator__width-paragraph') ?? Errors.handleError('null');
        this.rangeParagrapth = document.querySelector('.regulator__range-paragraph') ?? Errors.handleError('null');
        this.countParagrapth = document.querySelector('.regulator__count-paragraph') ?? Errors.handleError('null');
        this.canvasMenu = document.querySelector('.canvas__menu') ?? Errors.handleError('null');

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
        this.regulatorButtons.forEach((item) => {
            if (item.className == "regulator__button regulator__button_height") {
                this.initCanvasSliderListener(
                    item.offsetHeight + this.heightRegulatorBar.offsetHeight,
                    -item.offsetHeight - this.heightRegulatorBar.offsetHeight,
                    this.canvasDiv.offsetHeight / -(item.offsetHeight + this.heightRegulatorBar.offsetHeight),
                    this.body,
                    item,
                    this.heightRegulator,
                    this.heightRegulatorBar,
                    this.canvasDiv,
                    this.canvas,
                    this.canvasContext,
                    this.heightParagrapth,
                    'height'
                )
            }
            else if (item.className == "regulator__button regulator__button_width") {
                this.initCanvasSliderListener(
                    item.offsetHeight + this.widthRegulatorBar.offsetHeight,
                    -item.offsetHeight - this.widthRegulatorBar.offsetHeight,
                    this.canvasDiv.offsetWidth / -(item.offsetHeight + this.widthRegulatorBar.offsetHeight),
                    this.body,
                    item,
                    this.widthRegulator,
                    this.widthRegulatorBar,
                    this.canvasDiv,
                    this.canvas,
                    this.canvasContext,
                    this.widthParagrapth,
                    'width'
                )
            }
            else if (item.className == "regulator__button regulator__button_range") {
                this.initDBSCANSliderListener(
                    this.rangeRegulatorBar.offsetHeight,
                    -item.offsetHeight - this.rangeRegulatorBar.offsetHeight,
                    1.5,
                    this.body,
                    item,
                    this.widthRegulator,
                    this.rangeRegulatorBar,
                    this.canvasDiv,
                    this.canvas,
                    this.canvasContext,
                    this.rangeParagrapth,
                    'range',
                    960
                )
            }
            else if (item.className == "regulator__button regulator__button_count") {
                this.initDBSCANSliderListener(
                    this.countRegulatorBar.offsetHeight,
                    -item.offsetHeight - this.rangeRegulatorBar.offsetHeight,
                    1 / ((this.heightRegulator.offsetHeight - 60) / 255),
                    this.body,
                    item,
                    this.widthRegulator,
                    this.countRegulatorBar,
                    this.canvasDiv,
                    this.canvas,
                    this.canvasContext,
                    this.countParagrapth,
                    'count',
                    255
                )
            }
        })
        
        this.drawGrid(this.canvasContext, 'grey', Math.floor(this.canvas.width / 30), Math.floor(this.canvas.height / 30));
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
                this.canvasContext,
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
            callback(this.canvasContext, parseInt("30"), parseInt("3"));
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
