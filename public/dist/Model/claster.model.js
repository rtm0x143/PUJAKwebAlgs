import CanvasModel from "./canvas.model.js";
class ClasterModel extends CanvasModel {
    constructor() {
        super(...arguments);
        this.positions = [];
    }
    pushObject(y, x) {
        this.positions.push(y);
        this.positions.push(x);
        this.dispatchEvent(new Event('claster.model:addObj'));
    }
}
export default ClasterModel;
