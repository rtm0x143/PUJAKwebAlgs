import CanvasController from './canvas.controller.js';
import AstarView from '../View/astar.view.js';
import AstarModel from '../Model/astar.model.js';
import Errors from '../config/Errors.js';
import Point from '../Model/point.js';

class AstarController extends CanvasController {
    private readonly _astarModel: AstarModel;
    private _astarView: AstarView;
    private _isDrawingWalls: boolean = true;
    private _isStartPoint: boolean = false;
    private _isEndPoint: boolean = false;

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

        this._astarModel.setGridSize(new Point(20, 20));
        this._astarView.drawGrid(
            this._astarView.canvasGridContext,
            '#CFCFCF', 
            this._astarModel.gridResolution.x,
            this._astarModel.gridResolution.y
        );
    }

    buttonStartClickCallback() {
        this._isStartPoint = true;
        console.log("start point set");
        
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
                
            if (this._astarModel.grid[gridIndex.x] !== 1 && this._astarModel.grid[gridIndex.y] !== 1) {
                if (this._isStartPoint) {
                    // Clear previous start point
                    this.fillCell(this._astarModel.startPointMousePos, "#303030");
                    // Fill current start point cell
                    this.fillCell(mouseCanvasPos, "#52f193");
                    this._astarModel.setStartPoint(canvas2dCoords, mouseCanvasPos);
                    this._isStartPoint = false;
                    return;
                }
                else if (this._isEndPoint) {
                    // Clear previous end point
                    this.fillCell(this._astarModel.endPointMousePos, "#303030");
                    // Full current end point cell
                    this.fillCell(mouseCanvasPos, "#e7615a");
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
                this.fillCell(mouseCanvasPos, "#CFCFCF");
                this._astarModel.addWall(    
                    canvas2dCoords.x, 
                    canvas2dCoords.y
                );
            }
            else {
                this.fillCell(mouseCanvasPos, "#303030");
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
                this.fillCell(mouseCanvasPos, "#CFCFCF");
                this._astarModel.addWall(    
                    canvas2dCoords.x, 
                    canvas2dCoords.y
                );
            }
            else {
                this.fillCell(mouseCanvasPos, "#303030");
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

    // private fillCell(x: number, y: number, color: string): void {
    //     let steps = new Point(
    //         this._astarView.canvas.width / this._astarModel.gridResolution.x,
    //         this._astarView.canvas.height / this._astarModel.gridResolution.y,
    //     );

    //     let topLeftCorner = new Point(
    //         Math.floor(x / steps.x) * steps.x,
    //         Math.floor(y / steps.y) * steps.y,
    //     )

    //     this._astarView.canvasContext.fillStyle = color;
    //     this._astarView.canvasContext.fillRect(topLeftCorner.x, topLeftCorner.y, steps.x, steps.y);
    // }

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
        this.findPathRequest();
    }

    private findPathRequest(): Promise<Response> {
        let data = {
            "start": {'x': this._astarModel.startPoint.x, 'y': this._astarModel.startPoint.y},
            "end": {'x': this._astarModel.endPoint.x, 'y': this._astarModel.endPoint.y},
            "size": [this._astarModel.gridResolution.x, this._astarModel.gridResolution.y],
            // @ts-ignore
            "walls": buffer.Buffer.from(this._astarModel.grid).toString()
        }

        console.log(JSON.stringify(data));
        
        const response = fetch(`${this.urlValue}/alg/astar/`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return response;
    }

    findPathResponse() {
        this.findPathRequest().then((response) => {

        })
    }
}

export default AstarController;