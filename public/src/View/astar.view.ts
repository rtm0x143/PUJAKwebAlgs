import Errors from '../config/Errors.js';
import AstarModel from '../Model/astar.model';
import Brush from '../Model/brush.model.js';
import CanvasView from './canvas.view.js';
import { isThisTypeNode } from 'typescript';
import Point from '../Model/point.js';

class AstarView extends CanvasView {
    private _buttonStartPoint: HTMLButtonElement;
    private _buttonEndPoint: HTMLButtonElement;
    private _buttonFindPath: HTMLButtonElement;
    // private _buttonGenerate: HTMLButtonElement;
    private _astarModel: AstarModel; 

    public canvasGrid: HTMLCanvasElement;
    public canvasGridContext: CanvasRenderingContext2D;
    // private readonly _regulatorButtons: NodeListOf<HTMLButtonElement>;
    // private readonly _regulatorButtonGridWidth: HTMLButtonElement;
    // private readonly _regulatorButtonGridHeight: HTMLButtonElement;

    constructor (model: AstarModel) {
        super(model);

        this._astarModel = model;
        this._buttonStartPoint = document.querySelector('.button__start') ?? Errors.handleError("null");
        this._buttonEndPoint = document.querySelector('.button__end') ?? Errors.handleError("null");
        this._buttonFindPath = document.querySelector('.button__find-path') ?? Errors.handleError("null");

        this.canvasGrid = document.querySelector("#gridLayer") ?? Errors.handleError("null");
        this.canvasGridContext = this.canvasGrid.getContext('2d') ?? Errors.handleError("null");
        this.canvasGrid.width = parseInt(window.getComputedStyle(this.canvasWrapper, '').width);
        this.canvasGrid.height = parseInt(window.getComputedStyle(this.canvasWrapper, '').height);
        // this._regulatorButtons = document.querySelectorAll('.regulator__button');   
        // this._buttonStartPoint = document.querySelector('.buttons-menu__button_add-start') ?? Errors.handleError("null"); 
        // this._buttonEndPoint = document.querySelector('.buttons-menu__button_add-end') ?? Errors.handleError("null");
        // this._buttonGenerate = document.querySelector('.buttons-menu__button_generate') ?? Errors.handleError("null");

        this.subscribe();
        // this.drawGrid('grey', this._astarModel.gridResolution.x, this._astarModel.gridResolution.y);
    }

    private subscribe() {
        this._canvasModel.addEventListener('canvas.model:change', () => {
            this.canvasGrid.width = this._canvasModel.width;
            this.canvasGrid.height = this._canvasModel.height;
            
            this.drawGrid(
                this.canvasGridContext,
                '#CFCFCF', 
                this._astarModel.gridResolution.x,
                this._astarModel.gridResolution.y
            );

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
            // this.canvas.removeEventListener('mousedown', callbackMouseDownWrapper);
        });
    }
    
    // handleMouseMoveCanvas(callbackMouseMove: Function) {
    //     this.canvas.addEventListener('mousemove', (e: MouseEvent) => {
    //         callbackMouseMove;
    //     });
    // }

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

    // Этот медот должен брать данные из слайдера
    // TODO: добавить слайдер
    getGridSize(): Point {
        return new Point(20, 20);
    }
}

export default AstarView;