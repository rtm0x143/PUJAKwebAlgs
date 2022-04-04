import Errors from "../config/Errors.js";
import ClasterView from "../View/claster.view.js";
import Controller from "./Controller.js";
class ClasterController extends Controller {
    constructor(clasterModel) {
        super();
        this._clasterModel = clasterModel;
        this._clasterView = new ClasterView(this._clasterModel);
        this._clasterView.handleButtonClick(this.AddObjectCallback.bind(this));
        this._clasterView.handleDBSCANFetch(this.requestDBSCAN.bind(this));
    }
    AddObjectCallback(positionObject) {
        this._clasterModel.pushObject(positionObject.y, positionObject.x);
    }
    requestDBSCAN(context, range, groupSize) {
        fetch(`${this.urlValue}/alg/clasterisation?type=DBSCAN&range=${range}&gSize=${groupSize}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream'
            },
            body: (new Uint16Array(this._clasterModel.positions)).buffer
        }).then((responce) => {
            var _a;
            let reader = (_a = responce.body) === null || _a === void 0 ? void 0 : _a.getReader();
            reader === null || reader === void 0 ? void 0 : reader.read().then(({ done, value }) => {
                var _a;
                console.log(value);
                if (value == undefined)
                    Errors.handleError('undefined');
                let colorsArray = [];
                for (let i = 1; i < value.length; i += 2) {
                    if (value[i] >= 2) {
                        if (value[i - 1] > colorsArray.length) {
                            for (let j = colorsArray.length; j < value[i - 1]; ++j) {
                                colorsArray.push((_a = this.hsvToRGB(Math.floor(Math.random() * 361), 0.5 + Math.random() * 0.5, 0.5 + Math.random() * 0.5)) !== null && _a !== void 0 ? _a : Errors.handleError('undefined'));
                            }
                            this._clasterView.drawCircle(context, '', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], 5);
                        }
                        else {
                            this._clasterView.drawCircle(context, '', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], 5);
                        }
                    }
                    else {
                        this._clasterView.drawCircle(context, '', 'grey', this._clasterModel.positions[i], this._clasterModel.positions[i - 1], 5);
                    }
                }
            });
        });
    }
    requestKMeans() {
    }
}
export default ClasterController;
