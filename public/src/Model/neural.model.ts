import CanvasModel from "./canvas.model.js";
import INeural from "./interfaces/INeural";

class NeuralModel extends CanvasModel implements INeural{
    coords: Array<number> = [];
    answer: string = "";

    /**
     * function that fetch server and get data
     *
     * @param x - coordinate of x
     * @param y - coordinate of y
     * @param flag - boolean (disable mousedown dispatch)
     */
    addCoords(x: number, y: number, flag: boolean): void {
        this.coords.push(x);
        this.coords.push(y);

        if (flag) {
            this.dispatchEvent(new Event('neuralcoordschange'));
        }
    }

    setAnswer(value: string) {
        this.answer = value;
        this.dispatchEvent(new Event('answer:change'));
    }

    clearCanvas() {
        this.coords = [];
        this.dispatchEvent(new Event('canvas:clear'));
    }
}

export default NeuralModel;
