import NeuralView from "../View/neural.view";
import NeuralModel from "../Model/neural.model";
import Controller from "./Controller.js";

class NeuralController extends Controller {
    // class Objects
    private _neuralView: NeuralView;
    private _neuralModel: NeuralModel;

    private _isDrawing: Boolean;

    constructor(neuralView: NeuralView, neuralModel: NeuralModel) {
        super();

        //class Objects
        this._neuralView = neuralView;
        this._neuralModel = neuralModel;

        //flag for drawing on canvas
        this._isDrawing = false;

        //MouseDownEvent
        this._neuralView.mouseDownHandler((e: MouseEvent) => {
            this.mouseDown(e);
        })

        //MouseMoveEvent
        this._neuralView.mouseMoveHandler((e: MouseEvent) => {
            this.mouseMove(e);
        })

        //MouseUpEvent
        this._neuralView.mouseUpHandler(() => {
            this.mouseUp();
        })

        //fetchEvent
        this._neuralView.sendButtonHandler((imageData: ImageData) => {
            this.sendData(imageData);
        })
    }

    mouseDown(e: MouseEvent): void {
        this._isDrawing = true;
        this._neuralModel.addCoords(e.offsetX, e.offsetY, false);
    }

    mouseMove(e: MouseEvent): void {
        if (this._isDrawing) {
            this._neuralModel.addCoords(e.offsetX, e.offsetY, true);
        }
    }

    mouseUp(): void {
        if (this._isDrawing) {
            this._isDrawing = false;
        }
    }

    /**
     * function that fetch server and get data
     *
     * @param imageData - ImageData from canvas
     */
    sendData(imageData: ImageData): void {
        fetch(`${this.urlValue}/alg/neuralNet/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': `${imageData.data.length}`
            },
            body: imageData.data
        }).then((response: Response) => {
            console.log(response);
        });
    }
}

export default NeuralController;