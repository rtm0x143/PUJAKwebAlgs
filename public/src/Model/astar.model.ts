import CanvasModel from './canvas.model.js';
import Point from './point.js';

class AstarModel extends CanvasModel {
    public grid: Uint8Array = new Uint8Array(0);
    public gridResolution: Point = new Point(-1, -1);
    public startPoint: Point = new Point(-1, -1);
    public startPointMousePos: Point = new Point(-1, -1);
    public endPoint: Point = new Point(-1, -1);
    public endPointMousePos: Point = new Point(-1, -1);

    /**
     * Gets indices of x and y of the point
     * @param x 
     * @param y 
     * @returns Point with x and y indices
     */
    
    getIndex(x: number, y: number): number {
        return x + y * this.gridResolution.x
    }

     /**
     * Places new point in one-dimensional grid array;
     * x are only in even positions, whereas y are in odd only
     * @param x - x coordinate
     * @param y - y coordinate
     */
    addWall(x: number, y: number): void {
        let index: number = this.getIndex(x, y);
        
        this.grid[index] = 1;
    }

    removeWall(x: number, y: number) {
        let index: number = this.getIndex(x, y);

        this.grid[index] = 0;
    }

    setStartPoint(pointCoords: Point, mouseCanvasPos: Point): void {
        this.startPoint.x = pointCoords.x;
        this.startPoint.y = pointCoords.y;
        
        this.startPointMousePos.x = mouseCanvasPos.x;
        this.startPointMousePos.y = mouseCanvasPos.y;
    }

    setEndPoint(pointCoords: Point, mouseCanvasPos: Point): void {
        this.endPoint.x = pointCoords.x;
        this.endPoint.y = pointCoords.y;
        
        this.endPointMousePos.x = mouseCanvasPos.x;
        this.endPointMousePos.y = mouseCanvasPos.y;
    }

    setGridSize(gridResolution: Point) {
        this.grid = new Uint8Array(gridResolution.x * gridResolution.y);
        this.gridResolution = gridResolution;
    }

    clearVisitedCells() {
        console.log(this.grid.length);
        
        for (let i = 0; i < this.grid.length; ++i) {
            console.log(i, this.grid[i]);
            if (this.grid[i] === 2) {
                this.grid[i] = 0;
            }
        }
    }
}

export default AstarModel;