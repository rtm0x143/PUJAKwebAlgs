import CanvasModel from "./canvas.model.js";

class GraphModel extends CanvasModel {
    //data of model
    coords: Array<number> = [];
    currentWay!: Uint16Array;
    cost = Number.MAX_VALUE;

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

    updateWay(way: Uint16Array, cost: number) {
        if (this.cost > cost) {
            this.currentWay = way;
            this.dispatchEvent(new Event('way:change'))
        }
    }

    clearCanvas() {
        this.dispatchEvent(new Event('canvas:clear'));
        this.dispatchEvent(new Event('draw:circles'));
    }
}

export default GraphModel;