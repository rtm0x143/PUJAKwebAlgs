import CanvasModel from "./canvas.model.js";

class GraphModel extends CanvasModel {
    //data of model
    coords: Array<number> = [];
    costs: Float32Array = new Float32Array(4);
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
            console.log("change", this.cost, "to", cost);
            
            this.cost = cost;
            this.currentWay = way;
            this.clearCanvas();
            this.dispatchEvent(new Event('way:change'))
        }
    }

    setCosts(cost: number) {
        for (let i = 2; i > 0; --i) {
            if (this.costs[i]) {
                this.costs[i] = this.costs[i - 1];
            }
        }

        this.costs[0] = cost;

        this.dispatchEvent(new Event('add:costs'));
    }

    clearCanvas() {
        this.dispatchEvent(new Event('canvas:clear'));
        // this.dispatchEvent(new Event('draw:circles'));
    }
}

export default GraphModel;