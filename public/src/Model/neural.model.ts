import CanvasModel from "./canvas.model.js";

class NeuralModel extends CanvasModel {
    coords: Array<number> = [];

    addCoords(x: number, y: number, flag: boolean): void {
        this.coords.push(x);
        this.coords.push(y);

        if (flag) {
            this.dispatchEvent(new Event('neuralcoordschange'));
        }
    }
}

export default NeuralModel;
