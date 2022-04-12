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

    getSource(imageData: ImageData) {
        let minXPoint = Number.MAX_VALUE;
        let minYPoint = Number.MAX_VALUE;
        let maxXPoint = 0;
        let maxYPoint = 0;

        let index = Math.sqrt(imageData.data.length / 4);
        let j = 0;

        for (let i = 3; i < imageData.data.length; i += 4) {
            if (j === index) {
                j = 0;
            }

            if (imageData.data[i] !== 0) {
                if (j < minXPoint) {
                    minXPoint = j;
                }

                if (Math.floor(i / (index * 4)) < minYPoint) {
                    minYPoint = Math.floor(i / (index * 4));
                }

                if (j > maxXPoint) {
                    maxXPoint = j;
                }

                if (Math.floor(i / (index * 4)) > maxYPoint) {
                    maxYPoint = Math.floor(i / (index * 4));
                }
            }

            ++j;
        }

        console.log(minXPoint, maxXPoint);
        let sizeX = maxXPoint - minXPoint > maxYPoint - minYPoint ? maxXPoint - minXPoint : 0;
        let sizeY = maxYPoint - minYPoint > maxXPoint - minXPoint ? maxYPoint - minYPoint : 0;

        let offsetX = maxXPoint - minXPoint;
        let offsetY = maxYPoint - minYPoint;

        if (sizeY !== 0) {
            return {
                sX: minXPoint - sizeY * (1 / 2),
                sY: minYPoint - sizeY / 3,
                sWidth: sizeY + offsetX,
                sHeight: sizeY + sizeY * 2 / 3
            }
        } else {
            return {
                sX: minXPoint - sizeX * (1 / 3),
                sY: minYPoint - sizeX / 3,
                sWidth: sizeX + sizeX * (2 / 3),
                sHeight: sizeX * 2 / 3 + offsetY
            }
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
