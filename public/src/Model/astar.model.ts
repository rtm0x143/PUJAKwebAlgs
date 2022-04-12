import CanvasModel from './canvas.model.js';
import Point from './point.js';

class AstarModel extends CanvasModel {
    public grid: Uint8Array = new Uint8Array(0);
    public gridResolution: Point = new Point(-1, -1);
    public startPoint: Point = new Point(1, 1);
    public startPointMousePos: Point = new Point(-1, -1);
    public endPoint: Point = new Point(-1, -1);
    public endPointMousePos: Point = new Point(-1, -1);

    /**
     * Gets indices of x and y of the point
     * @param x 
     * @param y 
     * @returns Point with x and y indices
     */
    
    getIndex(x: number, y: number): Point {
        return new Point(
            2 * (x + y * this.gridResolution.x),
            2 * (x + y * this.gridResolution.x) + 1
        );
    }

     /**
     * Places new point in one-dimensional grid array;
     * x are only in even positions, whereas y are in odd only
     * @param x - x coordinate
     * @param y - y coordinate
     */
    addWall(x: number, y: number): void {
        let indices: Point = this.getIndex(x, y);
        
        this.grid[indices.x] = 1;
        this.grid[indices.y] = 1;
    }

    removeWall(x: number, y: number) {
        let indices: Point = this.getIndex(x, y);

        this.grid[indices.x] = 0;
        this.grid[indices.y] = 0;
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
        this.grid = new Uint8Array(2 * gridResolution.x * gridResolution.y);
        this.gridResolution = gridResolution;
    }
}

export default AstarModel;