import Errors from '../config/Errors.js';
import AstarModel from '../Model/astar.model';
import Brush from '../Model/brush.model.js';
import CanvasView from './canvas.view.js';
import { isThisTypeNode, textChangeRangeIsUnchanged } from 'typescript';
import Point from '../Model/point.js';
import { throws } from 'assert';

class AstarView extends CanvasView {
    static readonly colorGreen: string = "#52F193";
    static readonly colorRed: string = "#F25D52";
    static readonly colorBlack: string = "#303030";
    static readonly colorCreamyWhite: string = "#CFCFCF";
    static readonly colorVisited: string = "#5EF2F0";
    static readonly colorOpened: string = "#F2D546";
    static readonly colorCurrent: string = "#706BF2";
    static readonly colorPath: string = "#F22EC3";

    private _buttonStartPoint: HTMLButtonElement;
    private _buttonEndPoint: HTMLButtonElement;
    private _buttonFindPath: HTMLButtonElement;
    private _buttonGenerate: HTMLButtonElement;
    private _widthRangeInput: HTMLInputElement;
    private _heightRangeInput: HTMLInputElement;
    private _widthRangeInputText: HTMLSpanElement;
    private _heightRangeInputText: HTMLSpanElement;
    private _astarModel: AstarModel; 
    private _buttonClear: HTMLButtonElement;
    
    public buttonChooseHeuristics: HTMLButtonElement;
    // public  
    public heuristicsMenu: HTMLUListElement;
    public allHeuristicsLinks: NodeListOf<HTMLLIElement>;
    public canvasGrid: HTMLCanvasElement;
    public canvasGridContext: CanvasRenderingContext2D;

    constructor (model: AstarModel) {
        super(model);

        this._astarModel = model;
        this._buttonStartPoint = document.querySelector('.button__start') ?? Errors.handleError("null");
        this._buttonEndPoint = document.querySelector('.button__end') ?? Errors.handleError("null");
        this._buttonFindPath = document.querySelector('.button__find-path') ?? Errors.handleError("null");
        this._buttonGenerate = document.querySelector('.button__generate') ?? Errors.handleError("null");
        this._widthRangeInput = document.querySelector('.range-slider_width') ?? Errors.handleError("null");
        this._heightRangeInput = document.querySelector('.range-slider_height') ?? Errors.handleError("null");
        this._widthRangeInputText = document.querySelector('.range-slider__text_width') ?? Errors.handleError("null");
        this._heightRangeInputText = document.querySelector('.range-slider__text_height') ?? Errors.handleError("null");
        this.buttonChooseHeuristics = document.querySelector('.heuristics-switcher-menu .heuristics-switcher-button') ?? Errors.handleError("null");
        this.heuristicsMenu = document.querySelector('.heuristics-menu__closed') ?? Errors.handleError("null");
        this.allHeuristicsLinks = document.querySelectorAll('.link-container');
        this._buttonClear = document.querySelector('.button__clear') ?? Errors.handleError("null");

        this.canvasGrid = document.querySelector("#gridLayer") ?? Errors.handleError("null");
        this.canvasGridContext = this.canvasGrid.getContext('2d') ?? Errors.handleError("null");
        this.canvasGrid.width = parseInt(window.getComputedStyle(this.canvasWrapper, '').width);
        this.canvasGrid.height = parseInt(window.getComputedStyle(this.canvasWrapper, '').height);

        this.subscribe();
    }

    private subscribe() {
        this._canvasModel.addEventListener('canvas.model:change', () => {
            this.canvasGrid.width = this._canvasModel.width;
            this.canvasGrid.height = this._canvasModel.height;
            
            this.drawGridOn(
                this.canvasGridContext,
                '#CFCFCF', 
                this._astarModel.gridResolution.x,
                this._astarModel.gridResolution.y
            );
            
            // Draws field (walls, start and end points, algorithm visualization) on field canvas (main)
            this.drawField();
        });
        
        this._canvasModel.addEventListener('astar.model:gridSizeChanged', () => {
            this.clearAllDrawed();
            this.drawGridOn(
                this.canvasGridContext,
                '#CFCFCF',
                this._astarModel.gridResolution.x,
                this._astarModel.gridResolution.y
            );
            this._heightRangeInputText.innerHTML = this._astarModel.gridResolution.y.toString();
            this._widthRangeInputText.innerHTML = this._astarModel.gridResolution.x.toString(); 
        });
    }

    clearAllDrawed(): void {
        this.canvasGrid.width = this.canvasGrid.width;
        this.canvasGrid.height = this.canvasGrid.height;
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
    }

    clearWalls(): void {
        this.canvas.width = this.canvas.width;
        this.canvas.height = this.canvas.height;
        this._astarModel.clearAll();
    }

    drawField() {
        // Drawing walls
        this.canvasContext.fillStyle = '#CFCFCF';
        let cellWidth = this.canvas.width / this._astarModel.gridResolution.x;
        let cellHeight = this.canvas.height / this._astarModel.gridResolution.y;

        for (let i = 0; i < this._astarModel.gridResolution.y; ++i) {
            for (let j = 0; j < this._astarModel.gridResolution.x; ++j) {
                let currentPoint = this._astarModel.getIndex(j, i);
                
                if (this._astarModel.grid[currentPoint] == 1) {
                    this.canvasContext.fillRect(
                        j * cellWidth, 
                        i * cellHeight, 
                        cellWidth,
                        cellHeight
                    );
                }
            }
        }
        
        // Drawing start point
        this.canvasContext.fillStyle = "#52f193";
        this.canvasContext.fillRect(
            this._astarModel.startPoint.x * cellWidth,
            this._astarModel.startPoint.y * cellHeight,
            cellWidth,
            cellHeight
        );

        // Drawing end point
        this.canvasContext.fillStyle = "#e7615a";
        this.canvasContext.fillRect(
            this._astarModel.endPoint.x * cellWidth,
            this._astarModel.endPoint.y * cellHeight,
            cellWidth,
            cellHeight
        );
    }

    handleClear(clearWallsCallback: Function): void {
        this._buttonClear.addEventListener('click', () => {
            clearWallsCallback();
        });
    }

    handleMouseDownCanvas(callbackMouseDown: Function, callbackMouseMove: Function) {
        function callbackMouseMoveWrapper(e: MouseEvent) {
            callbackMouseMove(e);
        }

        let canvas = this.canvas;

        function callbackMouseDownWrapper(e: MouseEvent) {
            e.preventDefault();

            callbackMouseDown(e);
            canvas.addEventListener('mousemove', callbackMouseMoveWrapper);
        }
    
        this.canvas.addEventListener('mousedown', callbackMouseDownWrapper);

        document.addEventListener('mouseup', () => {
            this.canvas.removeEventListener('mousemove', callbackMouseMoveWrapper);
        });
    }

    

    // Handle button start event
    handleButtonStart(callbackButtonClick: Function) {
        function callbackButtonClickWrapper() {
            callbackButtonClick();
        }

        this._buttonStartPoint.addEventListener('click', callbackButtonClickWrapper);
    }

    handleButtonEnd(callbackButtonClick: Function) {
        function callbackButtonClickWrapper() {
            callbackButtonClick();
        }

        this._buttonEndPoint.addEventListener('click', callbackButtonClickWrapper);
    }

    handleButtonFindPath(callbackFindPath: Function) {
        function callbackFindPathWrapper() {
            callbackFindPath();
        }

        this._buttonFindPath.addEventListener('click', callbackFindPathWrapper);
    }

    handleButtonLabGen(labGenCallback: Function) {
        function callbackLabGenWrapper() {
            labGenCallback();
        }

        this._buttonGenerate.addEventListener('click', callbackLabGenWrapper);
    }

    handleRangeInputs(rangeInputCallback: Function) {
        this._heightRangeInput.addEventListener('input', () => rangeInputCallback());
        this._widthRangeInput.addEventListener('input', () => rangeInputCallback());
    }

    handleButtonHeuristics(buttonHeuristicsCallback: Function) {
        this.buttonChooseHeuristics.addEventListener('click', () => buttonHeuristicsCallback());
    }

    handleHeuristicsLinks(liHeuristicsLinksCallback: Function) {
        this.allHeuristicsLinks.forEach(li => {
            li.addEventListener('click', () => liHeuristicsLinksCallback(li));
        });
    }

    // Этот медот должен брать данные из слайдера
    // TODO: добавить слайдер
    getGridSize(): Point {
        return new Point(+this._widthRangeInput.value, +this._heightRangeInput.value);
    }
}

export default AstarView;
