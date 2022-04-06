import CanvasModel from "./canvas.model.js";

class GraphModel extends CanvasModel {
    //data of model
    coords: Array<number> = [];
    distances: Array<Array<number>> = [];

    /**
     * function that represent coords to distances between points
     * @param x - position of coordinate x
     * @param y - position of coordinate y
     */
    pushObject(x: number, y: number): void {
        this.coords.push(x);
        this.coords.push(y);
        this.dispatchEvent(new Event('canvas:change'))
    }

    /**
     * function that represent coords to distances between points but if points count more than 1
     */
    setDistances() {
        if (this.coords.length >= 4) {
            for (let i = 0; i < this.coords.length; i += 2) {
                this.distances[i] = [];

                for (let j = 0; j < this.coords.length; j += 2) {
                    if (i != j) {
                        this.distances[i][j] = this.findDistance(this.coords[i], this.coords[i + 1],
                            this.coords[j], this.coords[j + 1]);
                    }
                    else {
                        this.distances[i][j] = 0;
                    }
                }
            }
        }
    }

    /**
     * function that find way distance between to points
     * @param x1 - coordinate of x of first point
     * @param y1 - coordinate of y of first point
     * @param x2 - coordinate of x of second point
     * @param y2 - coordinate of y of second point
     */
    findDistance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}

export default GraphModel;