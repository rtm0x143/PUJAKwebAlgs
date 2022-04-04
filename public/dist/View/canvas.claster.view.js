import Errors from '../config/Errors.js';
import View from './View.js';
class CanvasClasterView extends View {
    constructor(model) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
        super();
        this.body = (_a = document.querySelector('body')) !== null && _a !== void 0 ? _a : Errors.handleError('null');
        this.regulatorButtons = (_b = document.querySelectorAll('.regulator__button')) !== null && _b !== void 0 ? _b : Errors.handleError('null');
        this.heightRegulator = (_c = document.querySelector('.regulator__width-param')) !== null && _c !== void 0 ? _c : Errors.handleError('null');
        this.widthRegulator = (_d = document.querySelector('.regulator__height-param')) !== null && _d !== void 0 ? _d : Errors.handleError('null');
        this.heightRegulatorBar = (_e = document.querySelector('.regulator__bar_height')) !== null && _e !== void 0 ? _e : Errors.handleError('null');
        this.widthRegulatorBar = (_f = document.querySelector('.regulator__bar_width')) !== null && _f !== void 0 ? _f : Errors.handleError('null');
        this.rangeRegulatorBar = (_g = document.querySelector('.regulator__bar_range')) !== null && _g !== void 0 ? _g : Errors.handleError('null');
        this.countRegulatorBar = (_h = document.querySelector('.regulator__bar_count')) !== null && _h !== void 0 ? _h : Errors.handleError('null');
        this.canvasDiv = (_j = document.querySelector('.canvas')) !== null && _j !== void 0 ? _j : Errors.handleError('null');
        this.canvas = (_k = document.querySelector('.canvas__element')) !== null && _k !== void 0 ? _k : Errors.handleError('null');
        this.canvasContext = (_l = this.canvas.getContext('2d')) !== null && _l !== void 0 ? _l : Errors.handleError('null');
        this.heightParagrapth = (_m = document.querySelector('.regulator__height-paragraph')) !== null && _m !== void 0 ? _m : Errors.handleError('null');
        this.widthParagrapth = (_o = document.querySelector('.regulator__width-paragraph')) !== null && _o !== void 0 ? _o : Errors.handleError('null');
        this.rangeParagrapth = (_p = document.querySelector('.regulator__range-paragraph')) !== null && _p !== void 0 ? _p : Errors.handleError('null');
        this.countParagrapth = (_q = document.querySelector('.regulator__count-paragraph')) !== null && _q !== void 0 ? _q : Errors.handleError('null');
        this.canvasMenu = (_r = document.querySelector('.canvas__menu')) !== null && _r !== void 0 ? _r : Errors.handleError('null');
        //Elements fo change canvas
        this._regulatorButton = (_s = document.querySelector('.regulator__button')) !== null && _s !== void 0 ? _s : Errors.handleError('null');
        //server data
        // this._rangeInput = document.querySelector('.range') ?? Errors.handleError('null');
        // this._groupInput = document.querySelector('.groupsize') ?? Errors.handleError('null');
        // //buttons to send on server ddata
        this._DBSCANButton = (_t = document.querySelector('.canvas__menu-button_DBSCAN')) !== null && _t !== void 0 ? _t : Errors.handleError('null');
        this._Kmeansutton = (_u = document.querySelector('.canvas__menu-button_kmeans')) !== null && _u !== void 0 ? _u : Errors.handleError('null');
        //Models
        this._clasterModel = model;
        //this._brush = new Brush();    add Brush
        this._subscribe();
        this.canvas.setAttribute('height', this.canvasDiv.offsetHeight.toString());
        this.canvas.setAttribute('width', this.canvasDiv.offsetWidth.toString());
        this.regulatorButtons.forEach((item) => {
            if (item.className == "regulator__button regulator__button_height") {
                this.initCanvasSliderListener(item.offsetHeight + this.heightRegulatorBar.offsetHeight, -item.offsetHeight - this.heightRegulatorBar.offsetHeight, this.canvasDiv.offsetHeight / -(item.offsetHeight + this.heightRegulatorBar.offsetHeight), this.body, item, this.heightRegulator, this.heightRegulatorBar, this.canvasDiv, this.canvas, this.canvasContext, this.heightParagrapth, 'height');
            }
            else if (item.className == "regulator__button regulator__button_width") {
                this.initCanvasSliderListener(item.offsetHeight + this.widthRegulatorBar.offsetHeight, -item.offsetHeight - this.widthRegulatorBar.offsetHeight, this.canvasDiv.offsetWidth / -(item.offsetHeight + this.widthRegulatorBar.offsetHeight), this.body, item, this.widthRegulator, this.widthRegulatorBar, this.canvasDiv, this.canvas, this.canvasContext, this.widthParagrapth, 'width');
            }
            else if (item.className == "regulator__button regulator__button_range") {
                this.initDBSCANSliderListener(this.rangeRegulatorBar.offsetHeight, -item.offsetHeight - this.rangeRegulatorBar.offsetHeight, 1.5, this.body, item, this.widthRegulator, this.rangeRegulatorBar, this.canvasDiv, this.canvas, this.canvasContext, this.rangeParagrapth, 'range', 960);
            }
            else if (item.className == "regulator__button regulator__button_count") {
                this.initDBSCANSliderListener(this.countRegulatorBar.offsetHeight, -item.offsetHeight - this.rangeRegulatorBar.offsetHeight, 1 / ((this.heightRegulator.offsetHeight - 60) / 255), this.body, item, this.widthRegulator, this.countRegulatorBar, this.canvasDiv, this.canvas, this.canvasContext, this.countParagrapth, 'count', 255);
            }
        });
        this.drawGrid(this.canvas, this.canvasContext, 'grey', Math.floor(this.canvas.width / 30), Math.floor(this.canvas.height / 30));
    }
    getMousePosition(event) {
        return {
            x: event.offsetX,
            y: event.offsetY
        };
    }
    handleButtonClick(callback) {
        return this.canvas.addEventListener('click', (event) => {
            event.preventDefault();
            callback(this.getMousePosition(event));
        });
    }
    _subscribe() {
        this._clasterModel.addEventListener('claster.model:addObj', () => {
            this.drawCircle(this.canvasContext, '', 'red', this._clasterModel.positions[this._clasterModel.positions.length - 1], this._clasterModel.positions[this._clasterModel.positions.length - 2], 5);
        });
    }
    handleDBSCANFetch(callback) {
        this._DBSCANButton.addEventListener('click', (event) => {
            event.preventDefault();
            callback(this.canvasContext, parseInt("30"), parseInt("3"));
        });
    }
    handleKMeansFetch(callback) {
        this._Kmeansutton.addEventListener('click', (event) => {
            event.preventDefault();
            callback();
        });
    }
}
export default CanvasClasterView;
