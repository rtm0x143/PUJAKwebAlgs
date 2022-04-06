import Errors from "../config/Errors.js";
import ClasterView from "../View/claster.view.js";
import Controller from "./Controller.js";
class ClasterController extends Controller {
    constructor(clasterModel) {
        super();
        this._clasterModel = clasterModel;
        this._clasterView = new ClasterView(this._clasterModel);
        this._clasterView.handleButtonClick(this.AddObjectCallback.bind(this));
        this._clasterView.handleKmeansClick(this.kmeansClickCallback.bind(this));
        this._clasterView.handleFetch(this.request.bind(this));
    }
    AddObjectCallback(positionObject) {
        this._clasterModel.pushObject(positionObject.y, positionObject.x);
    }
    kmeansClickCallback(menu) {
        if (getComputedStyle(menu).display === 'none') {
            menu.style.display = 'block';
        }
        else {
            menu.style.display = 'none';
        }
    }
    request(type, context, range, groupSize, metricType, clastersCount, radius) {
        if (type === 'none') {
            fetch(`${this.urlValue}/alg/clasterisation?type=DBSCAN&range=${range}&gSize=${groupSize}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                body: (new Uint16Array(this._clasterModel.positions)).buffer
            }).then((response) => {
                var _a;
                let reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
                reader === null || reader === void 0 ? void 0 : reader.read().then(({ done, value }) => {
                    var _a;
                    if (value == undefined)
                        Errors.handleError('undefined');
                    if (value == null)
                        Errors.handleError('null');
                    let colorsArray = [];
                    for (let i = 1; i < value.length; i += 2) {
                        if (value[i] >= 2) {
                            if (value[i - 1] > colorsArray.length) {
                                for (let j = colorsArray.length; j < value[i - 1]; ++j) {
                                    colorsArray.push((_a = this.hsvToRGB(Math.floor(Math.random() * 361), 1, 0.8 + Math.random() * 0.2)) !== null && _a !== void 0 ? _a : Errors.handleError('undefined'));
                                }
                                this._clasterView.drawCircle(context, '', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], radius);
                            }
                            else {
                                this._clasterView.drawCircle(context, '', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], radius);
                            }
                        }
                        else {
                            this._clasterView.drawCircle(context, '', 'grey', this._clasterModel.positions[i], this._clasterModel.positions[i - 1], radius);
                        }
                    }
                });
            });
        }
        else {
            fetch(`${this.urlValue}/alg/clasterisation?type=k_means&pCount=${2}&metric=${metricType}[&cCount=${clastersCount}]`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                body: (new Uint16Array(this._clasterModel.positions)).buffer
            }).then((response) => {
                var _a;
                let reader = (_a = response.body) === null || _a === void 0 ? void 0 : _a.getReader();
                reader === null || reader === void 0 ? void 0 : reader.read().then(({ done, value }) => {
                    var _a;
                    if (value == undefined)
                        Errors.handleError('undefined');
                    if (value == null)
                        Errors.handleError('null');
                    let colorsArray = [];
                    for (let i = 1; i < value.length; i += 2) {
                        if (value[i] >= 2) {
                            if (value[i - 1] > colorsArray.length) {
                                for (let j = colorsArray.length; j < value[i - 1]; ++j) {
                                    colorsArray.push((_a = this.hsvToRGB(Math.floor(Math.random() * 361), 1, 0.8 + Math.random() * 0.2)) !== null && _a !== void 0 ? _a : Errors.handleError('undefined'));
                                }
                                this._clasterView.drawCircle(context, '', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], radius);
                            }
                            else {
                                this._clasterView.drawCircle(context, '', colorsArray[value[i - 1] - 1], this._clasterModel.positions[i], this._clasterModel.positions[i - 1], radius);
                            }
                        }
                        else {
                            this._clasterView.drawCircle(context, '', 'grey', this._clasterModel.positions[i], this._clasterModel.positions[i - 1], radius);
                        }
                    }
                });
            });
        }
    }
}
export default ClasterController;