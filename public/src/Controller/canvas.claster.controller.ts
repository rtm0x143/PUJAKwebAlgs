import Errors from "../config/Errors.js";
import ClasterModel from "../Model/claster.model";
import CanvasClasterView from "../View/canvas.claster.view.js";
import Controller from "./Controller.js";

class ClasterController extends Controller{
    private _clasterView: CanvasClasterView;
    private _clasterModel: ClasterModel;

    constructor(clasterModel: ClasterModel) {
        super();

        this._clasterModel = clasterModel;
        this._clasterView = new CanvasClasterView(this._clasterModel);
        this._clasterView.handleButtonClick(this.AddObjectCalback.bind(this));
        this._clasterView.handleDBSCANFetch(this.requestDBSCAN.bind(this));
    }
    
    AddObjectCalback(positionObject: {x: number, y: number}) {
        this._clasterModel.pushObject(positionObject.y, positionObject.x);
    }

    requestDBSCAN(range: number, groupSize: number) {
        fetch(`alg/clasterisation?type=DBSCAN&range=${range}&gSize=${groupSize}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            },

            body: (new Uint16Array(this._clasterModel.positions)).buffer
        }).then((responce) => {
            let reader = responce.body?.getReader();
            reader?.read().then(({ done, value }) => {
                console.log(value);
                console.log(this._clasterModel.positions);

                if (value == undefined) Errors.handleError('undefined');
                let colorsArray = []

                for (let i = 1; i < value.length; i += 2) {
                    if (value[i] >= 2) {
                        if (value[i - 1] > colorsArray.length) {
                            for (let j = colorsArray.length; j < value[i - 1]; ++j) {
                                colorsArray.push(this.hsvToRGB(Math.floor(Math.random() * 361), 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5) ?? Errors.handleError('undefined'));
                            }
                            
                            this._clasterView.changeCanvasView('', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], i);
                        }
                        else {
                            this._clasterView.changeCanvasView('', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], i);
                        }
                    }
                    else {
                        this._clasterView.changeCanvasView('', 'grey', this._clasterModel.positions[i], this._clasterModel.positions[i - 1], i);
                    }
                }
                console.log(colorsArray);
            })
        })
    }

    requestKMeans() {

    }
}

export default ClasterController;