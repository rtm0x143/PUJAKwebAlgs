import NeuralView from "../View/neural.view";
import NeuralModel from "../Model/neural.model";
import Controller from "./Controller.js";

class NeuralController extends Controller {
    private _neuralView: NeuralView;
    private _neuralModel: NeuralModel;
    private _isDrawing: Boolean;

    constructor(neuralView: NeuralView, neuralModel: NeuralModel) {
        super();

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
        this._neuralView.mouseUpHandler((e: MouseEvent) => {
            this.mouseUp(e);
        })

        //fetchEvent
        this._neuralView.sendButtonHandler((imageData: ImageData) => {
            this.sendData(imageData);
        })
    }

    mouseDown(e: MouseEvent) {
        this._isDrawing = true;
        this._neuralModel.addCoords(e.offsetX, e.offsetY, false);
    }

    mouseMove(e: MouseEvent) {
        if (this._isDrawing) {
            this._neuralModel.addCoords(e.offsetX, e.offsetY, true);
        }
    }

    mouseUp(e: MouseEvent) {
        if (this._isDrawing) {
            this._isDrawing = false;
        }
    }

    sendData(imageData: ImageData) {
        fetch(`${this.urlValue}/alg/neuralNet/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
                'Content-Length': `${imageData.data.length}`
            },
            body: imageData.data
        }).then((responce: Response) => {
            console.log(responce);
        });
    }
}

export default NeuralController;