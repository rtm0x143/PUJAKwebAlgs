import CanvasController from './canvas.controller.js';
import AstarView from '../View/astar.view.js';
import AstarModel from '../Model/astar.model.js';
import Errors from '../config/Errors.js';
import Point from '../Model/point.js';
import { convertTypeAcquisitionFromJson } from 'typescript';

class AstarController extends CanvasController {
    private readonly _astarModel: AstarModel;
    private _astarView: AstarView;
    private _isDrawingWalls: boolean = true;
    private _isStartPoint: boolean = false;
    private _isEndPoint: boolean = false;
    private _isMenuOpened: boolean = false;

    constructor(model: AstarModel) {
        super(model);

        this._astarModel = model;
        this._astarView = new AstarView(model);

        this._astarView.handleMouseDownCanvas((e: MouseEvent) => {
            this.drawMouseDownCallback(e);
        }, (e: MouseEvent) => {
            this.drawMouseMoveCallback(e);
        });

        this._astarView.handleButtonStart(() => {
            this.buttonStartClickCallback();
        });

        this._astarView.handleButtonEnd(() => {
            this.buttonEndClickCallback();
        });

        this._astarView.handleButtonFindPath(() => {
            this.findPathCallback();
        });

        this._astarView.handleButtonLabGen(() => {
            this.labGenCallback();
        });
        
        this._astarView.handleRangeInputs(() => {            
            this.rangeInputCallback();
        });

        this._astarView.handleButtonHeuristics(() => {
            this.buttonHeuristicsCallback();
        });

        this._astarView.handleHeuristicsLinks((li: HTMLLIElement) => {
            this.liHeuristicsLinksCallback(li);
        });

        this._astarView.handleClear(() => {
            this.clearCallback();
        });

        this._astarModel.setGridSize(this._astarView.getGridSize());
        this._astarView.drawGridOn(
            this._astarView.canvasGridContext,
            AstarView.colorCreamyWhite, 
            this._astarModel.gridResolution.x,
            this._astarModel.gridResolution.y
        );
    }

    clearCallback() {
        this._astarModel.clearAll();
        this._astarView.clearAllDrawed();
        this._astarView.drawGridOn(
            this._astarView.canvasGridContext,
            AstarView.colorCreamyWhite,
            this._astarModel.gridResolution.x,
            this._astarModel.gridResolution.y
        );
    }

    liHeuristicsLinksCallback(li: HTMLLIElement) {
        let buttonId = this._astarView.buttonChooseHeuristics.id;
        let buttonText = this._astarView.buttonChooseHeuristics.textContent;
        let buttonChildren = this._astarView.buttonChooseHeuristics.children[0];
        let liChildren = li.children[0];

        this._astarView.buttonChooseHeuristics.id = li.id;
        buttonChildren.textContent = liChildren.textContent;
        
        li.id = buttonId;
        liChildren.textContent = buttonText;
    }

    buttonHeuristicsCallback() {
        if (!this._isMenuOpened) {
            this._astarView.heuristicsMenu.className = "heuristics-menu__opened";
            this._isMenuOpened = true;
        }
        else {
            this._astarView.heuristicsMenu.className = "heuristics-menu__closed";
            this._isMenuOpened = false;
        }
    }

    rangeInputCallback() {
        this._astarModel.setGridSize(this._astarView.getGridSize());
    }

    buttonStartClickCallback() {
        this._isStartPoint = true;
    }

    buttonEndClickCallback() {
        this._isEndPoint = true;
    }

    drawMouseDownCallback(e: MouseEvent) {
        this._mousePosX = e.x;
        this._mousePosY = e.y;

        let canvasBoundingClientRect = this._astarView.canvas.getBoundingClientRect();
        
        if (this.isMouseInsideCanvas(canvasBoundingClientRect)) {
            // Mouse position relative to canvas
            let mouseCanvasPos = new Point(
                this._mousePosX - canvasBoundingClientRect.left,
                this._mousePosY - canvasBoundingClientRect.top
            );
            
            // Coordinates of 2 dimensional array representing canvas grid
            let canvas2dCoords = new Point(
                Math.floor(mouseCanvasPos.x / (this._astarView.canvas.width / this._astarModel.gridResolution.x)),
                Math.floor(mouseCanvasPos.y / (this._astarView.canvas.height / this._astarModel.gridResolution.y))
            );

            // 2-dimensional coordinates transformated into 1-dimensional 
            let gridIndex = this._astarModel.getIndex(canvas2dCoords.x, canvas2dCoords.y);

            if ((canvas2dCoords.x === this._astarModel.startPoint.x &&
                canvas2dCoords.y === this._astarModel.startPoint.y) || 
                canvas2dCoords.x === this._astarModel.endPoint.x &&
                canvas2dCoords.y === this._astarModel.endPoint.y) {
                return;
            }
                
            if (this._astarModel.grid[gridIndex] !== 1) {
                if (this._isStartPoint) {
                    // Clear previous start point
                    this.fillCell(this._astarModel.startPointMousePos, AstarView.colorBlack);
                    // Fill current start point cell
                    this.fillCell(mouseCanvasPos, AstarView.colorGreen);
                    this._astarModel.setStartPoint(canvas2dCoords, mouseCanvasPos);
                    this._isStartPoint = false;
                    return;
                }
                else if (this._isEndPoint) {
                    // Clear previous end point
                    this.fillCell(this._astarModel.endPointMousePos, AstarView.colorBlack);
                    // Full current end point cell
                    this.fillCell(mouseCanvasPos, AstarView.colorRed);
                    this._astarModel.setEndPoint(canvas2dCoords, mouseCanvasPos);
                    this._isEndPoint = false;
                    return;
                }

                this._isDrawingWalls = true;
                
            }
            else {
                this._isDrawingWalls = false;
            }

            if (this._isDrawingWalls) {
                this.fillCell(mouseCanvasPos, AstarView.colorCreamyWhite);
                this._astarModel.addWall(    
                    canvas2dCoords.x, 
                    canvas2dCoords.y
                );
            }
            else {
                this.fillCell(mouseCanvasPos, AstarView.colorBlack);
                this._astarModel.removeWall(    
                    canvas2dCoords.x, 
                    canvas2dCoords.y
                );
            }
        }
    }

    // Подумать над тем, чтобы перенести информацию о канвасе в переменную и изменять при ресайзе.
    drawMouseMoveCallback(e: MouseEvent) {
        this._mousePosX = e.x;
        this._mousePosY = e.y;

        let canvasBoundingClientRect = this._astarView.canvas.getBoundingClientRect();
        
        if (this.isMouseInsideCanvas(canvasBoundingClientRect)) {
            // Mouse position relative to canvas
            let mouseCanvasPos = new Point(
                this._mousePosX - canvasBoundingClientRect.left,
                this._mousePosY - canvasBoundingClientRect.top
            );
            
            // Coordinates of 2 dimensional array representing canvas grid
            let canvas2dCoords = new Point(
                Math.floor(mouseCanvasPos.x / (this._astarView.canvas.width / this._astarModel.gridResolution.x)),
                Math.floor(mouseCanvasPos.y / (this._astarView.canvas.height / this._astarModel.gridResolution.y))
            );

            if ((canvas2dCoords.x === this._astarModel.startPoint.x &&
                canvas2dCoords.y === this._astarModel.startPoint.y) || 
                canvas2dCoords.x == this._astarModel.endPoint.x &&
                canvas2dCoords.y === this._astarModel.endPoint.y) {
                return;
            }

            if (this._isDrawingWalls) {
                this.fillCell(mouseCanvasPos, AstarView.colorCreamyWhite);
                this._astarModel.addWall(    
                    canvas2dCoords.x, 
                    canvas2dCoords.y
                );
            }
            else {
                this.fillCell(mouseCanvasPos, AstarView.colorBlack);
                this._astarModel.removeWall(    
                    canvas2dCoords.x, 
                    canvas2dCoords.y
                );
            }
        }
    }

    private isMouseInsideCanvas(canvasBoundingClientRect: DOMRect) {        
        return this._mousePosX >= canvasBoundingClientRect.left && 
        this._mousePosY >= canvasBoundingClientRect.top &&
        this._mousePosX < canvasBoundingClientRect.right &&
        this._mousePosY < canvasBoundingClientRect.bottom;
    }

    sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
  
    private fillCell(point: Point, color: string): void {
        let steps = new Point(
            this._astarView.canvas.width / this._astarModel.gridResolution.x,
            this._astarView.canvas.height / this._astarModel.gridResolution.y,
        );

        let topLeftCorner = new Point(
            Math.floor(point.x / steps.x) * steps.x,
            Math.floor(point.y / steps.y) * steps.y,
        )

        this._astarView.canvasContext.fillStyle = color;
        this._astarView.canvasContext.fillRect(topLeftCorner.x, topLeftCorner.y, steps.x, steps.y);
    }

    findPathCallback(): void {
        let response = this.findPathRequest();
        this.findPathResponse(response);
    }

    isPointValid(point: Point): boolean {
        if (
            point.x >= 0 && point.x < this._astarModel.gridResolution.x &&
            point.y >= 0 && point.y < this._astarModel.gridResolution.y
        ) {
            return true;
        }

        return false;
    }

    private findPathRequest(): Promise<Response> {
        if (
            !this.isPointValid(this._astarModel.startPoint) ||
            !this.isPointValid(this._astarModel.endPoint)
        ) {
            Errors.handleError('incorrectData');
        }
        
        let data = {
            end: {
                x: this._astarModel.endPoint.x, 
                y: this._astarModel.endPoint.y
            },
            start: {
                x: this._astarModel.startPoint.x, 
                y: this._astarModel.startPoint.y
            },
            field: {
                height: this._astarModel.gridResolution.y, 
                width: this._astarModel.gridResolution.x,
                // @ts-ignore
                data: buffer.Buffer.from(this._astarModel.grid.buffer).toString()
            },
        }
        
        const response = fetch(`${this.urlValue}/alg/astar?${this._astarView.buttonChooseHeuristics.id}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response;
    }

    findPathResponse(algStepsAndPathResponse: Promise<Response>) {
        algStepsAndPathResponse.then(async (response) => {
            let reader = response.body?.getReader() ?? Errors.handleError("undefined");
            let pathStart = -1;

            this.findPathResponseRead(reader, pathStart).then(() => this._astarModel.clearVisited());
        })
    }

    private async findPathResponseRead(reader: ReadableStreamDefaultReader<Uint8Array>, pathArrayStart: number): Promise<void> {
        return reader?.read().then(async ({done, value}) => {
            if (done) return;
            if (value === undefined) Errors.handleError("undefined");
            if (value === null) Errors.handleError("null");

            if (pathArrayStart === -1) {
                pathArrayStart = await this.drawAlgSteps(value);
            }
            
            if (pathArrayStart !== -1) {
                this.drawPath(value, pathArrayStart);
            }
            
            if (!done) return this.findPathResponseRead(reader, pathArrayStart);
        });
    }

    fillCellByGridCoordinates(point: Point, color: string) {
        let steps = new Point(
            this._astarView.canvas.width / this._astarModel.gridResolution.x,
            this._astarView.canvas.height / this._astarModel.gridResolution.y,
        );

        let topLeftCorner = new Point(
            point.x * steps.x,
            point.y * steps.y
        );

        this._astarView.canvasContext.fillStyle = color;
        this._astarView.canvasContext.fillRect(topLeftCorner.x, topLeftCorner.y, steps.x, steps.y);
    }

    findNeighbors(currentPoint: Point): Array<Point> {
        let neighbors: Array<Point> = [];

        for (let n = -1; n <= 1; ++n) {
            for (let m = -1; m <= 1; ++m) {
                if (n === 0 && m === 0) continue;

                let move = new Point(
                    currentPoint.x + m,
                    currentPoint.y + n
                );

                if (
                    move.x >= 0 && move.x < this._astarModel.gridResolution.x &&
                    move.y >= 0 && move.y < this._astarModel.gridResolution.y
                ) {
                    let index: number = this._astarModel.getIndex(move.x, move.y);

                    // 1 - wall,
                    // 2 - visited cell
                    if (
                        this._astarModel.grid[index] !== 1 &&
                        this._astarModel.grid[index] !== 2 &&
                        !move.equals(this._astarModel.startPoint) &&
                        !move.equals(this._astarModel.endPoint)
                    ) {
                        neighbors.push(move);
                    }
                }
            }
        }

        return neighbors;
    }

    // visited cell: #5EF2F0
    // opened cell: #F2D546
    // current cell: #706BF2
    async drawAlgSteps(responseArray: Uint8Array) {
        let pathStart = -1;
        
        for (let i = 0; i < responseArray.length; i += 2) {
            let currentPoint = new Point(responseArray[i + 1], responseArray[i]);

            // If end point was reached in alg steps part of an array
            if (currentPoint.x === this._astarModel.endPoint.x && currentPoint.y === this._astarModel.endPoint.y) {
                pathStart = i + 2;
                break;
            }
            
            this.fillCellByGridCoordinates(currentPoint, AstarView.colorCurrent);
            
            let neighbors = this.findNeighbors(currentPoint);

            for (let k = 0; k < neighbors.length; ++k) {      
                this.fillCellByGridCoordinates(neighbors[k], AstarView.colorOpened);
                await this.sleep(3000 / responseArray.length);
            }
            
            // Change value and color of the current cell to visited
            this._astarModel.grid[this._astarModel.getIndex(currentPoint.x, currentPoint.y)] = 2;
            if (currentPoint.equals(this._astarModel.startPoint)) {
                this.fillCellByGridCoordinates(currentPoint, "#52F193");
            }
            else {
                this.fillCellByGridCoordinates(currentPoint, AstarView.colorVisited);
            }
        }

        return pathStart
    }

    async drawPath(responseArray: Uint8Array, pathStart: number): Promise<void> {
        for (let i = pathStart; i < responseArray.length; i += 2) {
            let currentPoint = new Point(responseArray[i + 1], responseArray[i]);
            this.fillCellByGridCoordinates(currentPoint, AstarView.colorPath);
            await this.sleep(3000 / responseArray.length);
        }
    }

    labGenCallback() {
        let response = this.labGenRequest();
        this.labGenResponse(response);
    }

    private labGenRequest(): Promise<Response> {
        let gridSize: Point = this._astarModel.gridResolution;

        const response = fetch(`${this.urlValue}/alg/labgen?height=${gridSize.y}&width=${gridSize.x}`);
        
        return response;
    }

    private labGenResponse(labyrinthResponse: Promise<Response>) {
        labyrinthResponse.then((response) => {
            let reader = response.body?.getReader() ?? Errors.handleError("undefined");
            
            this.labGenResponseRead(reader).then(() => this._astarView.drawField());
        });
    }

    private async labGenResponseRead(reader: ReadableStreamDefaultReader<Uint8Array>): Promise<void> {
        const { done, value } = await reader.read();
        if (done) return;
        if (value === undefined) Errors.handleError("null");
        if (value === null) Errors.handleError("null");

        for (let i = 0; i < value.length; ++i) {
            this._astarModel.grid[i] = value[i];
        }

        if (!done) return this.labGenResponseRead(reader);  
    }
}

export default AstarController;
