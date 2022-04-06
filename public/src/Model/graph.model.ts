import CanvasModel from "./canvas.model.js";

class GraphModel extends CanvasModel {
    coords: Array<number> = [];
    distances: Array<Array<number>> = [];

    pushObject(x: number, y: number): void {
        this.coords.push(x);
        this.coords.push(y);
        this.dispatchEvent(new Event('ant.model:addObj'))
    }

    setDistances() {
        for (let i = 0; i < this.coords.length / 2; ++i) {
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

    findDistance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    }
}

export default GraphModel;