import CanvasModel from "./canvas.model.js";

class ClasterModel extends CanvasModel {
    positions: Array<number> = [];
    
    pushObject(y: number, x: number): void {
        this.positions.push(y);
        this.positions.push(x);
        this.dispatchEvent(new Event('claster.model:addObj'))
    }
}

export default ClasterModel;