import Errors from "../config/Errors.js";
import ClasterModel from "../Model/claster.model";
import ClasterView from "../View/claster.view.js";
import CanvasController from "../Controller/canvas.controller.js";

class ClasterController extends CanvasController {
    private _clasterView: ClasterView;
    private readonly _clasterModel: ClasterModel;

    constructor(clasterModel: ClasterModel) {
        super(clasterModel);

        this._clasterModel = clasterModel;
        this._clasterView = new ClasterView(this._clasterModel);
        this._clasterView.handleButtonClick(this.AddObjectCallback.bind(this));
        this._clasterView.handleKmeansClick(this.kmeansClickCallback.bind(this))
        this._clasterView.handleFetch(this.request.bind(this));
    }
    
    AddObjectCallback(positionObject: {x: number, y: number}) {
        this._clasterModel.pushObject(positionObject.y, positionObject.x);
    }

    kmeansClickCallback(menu: HTMLDivElement) {
        if (getComputedStyle(menu).display === 'none') {
            menu.style.display = 'block';
        } else {
            menu.style.display = 'none';
        }
    }

    request(
        type: string,
        context: CanvasRenderingContext2D,
        range: number,
        groupSize: number,
        metricType: string,
        clastersCount: string,
        radius: number
    ) {
        if (type === 'none') {
            fetch(`${this.urlValue}/alg/clasterisation?type=DBSCAN&range=${range}&gSize=${groupSize}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },

                body: (new Uint16Array(this._clasterModel.positions)).buffer
            }).then((response) => {
                let reader = response.body?.getReader();
                reader?.read().then(({value}) => {
                    if (value === undefined) Errors.handleError('undefined');
                    if (value === null) Errors.handleError('null');
                    let colorsArray = []

                    for (let i = 1; i < value.length; i += 2) {
                        if (value[i] >= 2) {
                            if (value[i - 1] > colorsArray.length) {
                                for (let j = colorsArray.length; j < value[i - 1]; ++j) {
                                    colorsArray.push(this._clasterView.hsvToRGB(
                                        Math.floor(
                                            Math.random() * 361
                                        ),
                                        1,
                                        0.8 + Math.random() * 0.2) ?? Errors.handleError('undefined')
                                    );
                                }

                                this._clasterView.drawCircle(
                                    this._clasterView.canvasContext,
                                    '',
                                    colorsArray[value[i - 1] - 1],
                                    this._clasterModel.positions[i],
                                    this._clasterModel.positions[i - 1],
                                    radius
                                );
                            } else {
                                this._clasterView.drawCircle(
                                    this._clasterView.canvasContext,
                                    '',
                                    colorsArray[value[i - 1] - 1],
                                    this._clasterModel.positions[i],
                                    this._clasterModel.positions[i - 1],
                                    radius
                                );
                            }
                        } else {
                            this._clasterView.drawCircle(
                                this._clasterView.canvasContext,
                                '',
                                'grey',
                                this._clasterModel.positions[i],
                                this._clasterModel.positions[i - 1],
                                radius
                            );
                        }
                    }
                })
            })
        } else {
            fetch(clastersCount ?
            `${this.urlValue}/alg/clasterisation?type=k_means&pCount=${2}&metric=${metricType}&cCount=${clastersCount}`:
                `${this.urlValue}/alg/clasterisation?type=k_means&pCount=${2}&metric=${metricType}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },

                body: (new Uint16Array(this._clasterModel.positions)).buffer
            }).then((response) => {
                let reader = response.body?.getReader();
                reader?.read().then(({ value}) => {
                    console.log(value);
                    if (value === undefined) Errors.handleError('undefined');
                    if (value === null) Errors.handleError('null');
                    let colorsArray = []

                    for (let i = 0, k = 0; i < value.length; ++i, k += 2) {
                        if (value[i] + 1 > colorsArray.length) {
                            for (let j = colorsArray.length; j < value[i] + 1; ++j) {
                                colorsArray.push(this._clasterView.hsvToRGB(
                                    Math.floor(
                                        Math.random() * 361
                                    ),
                                    1,
                                    1) ?? Errors.handleError('undefined')
                                );
                            }

                            this._clasterView.drawCircle(
                                this._clasterView.canvasContext,
                                '',
                                colorsArray[value[i]],
                                this._clasterModel.positions[k + 1],
                                this._clasterModel.positions[k],
                                radius
                            );
                        } else {
                            this._clasterView.drawCircle(
                                this._clasterView.canvasContext,
                                '',
                                colorsArray[value[i]],
                                this._clasterModel.positions[k + 1],
                                this._clasterModel.positions[k],
                                radius
                            );
                        }
                    }

                    console.log(colorsArray);
                })
            })
        }
    }
}

export default ClasterController;