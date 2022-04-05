import Errors from "../config/Errors.js";
import ClasterModel from "../Model/claster.model";
import ClasterView from "../View/claster.view.js";
import Controller from "./Controller.js";

class ClasterController extends Controller{
    private _clasterView: ClasterView;
    private _clasterModel: ClasterModel;

    constructor(clasterModel: ClasterModel) {
        super();

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

    request(type: string, context: CanvasRenderingContext2D, range: number, groupSize: number, radius: number) {
        if (type === 'none') {
            fetch(`${this.urlValue}/alg/clasterisation?type=DBSCAN&range=${range}&gSize=${groupSize}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream'
                },

                body: (new Uint16Array(this._clasterModel.positions)).buffer
            }).then((response) => {
                let reader = response.body?.getReader();
                reader?.read().then(({done, value}) => {
                    if (value == undefined) Errors.handleError('undefined');
                    if (value == null) Errors.handleError('null');
                    let colorsArray = []

                    console.log(value)

                    for (let i = 1; i < value.length; i += 2) {
                        if (value[i] >= 2) {
                            if (value[i - 1] > colorsArray.length) {
                                for (let j = colorsArray.length; j < value[i - 1]; ++j) {
                                    colorsArray.push(this.hsvToRGB(
                                        Math.floor(
                                            Math.random() * 361
                                        ),
                                        0.5 + Math.random() * 0.5,
                                        0.5 + Math.random() * 0.5) ?? Errors.handleError('undefined')
                                    );
                                }

                                this._clasterView.drawCircle(
                                    context,
                                    '',
                                    colorsArray[value[i - 1] - 1],
                                    this._clasterModel.positions[i],
                                    this._clasterModel.positions[i - 1],
                                    radius
                                );
                            } else {
                                this._clasterView.drawCircle(
                                    context,
                                    '',
                                    colorsArray[value[i - 1] - 1],
                                    this._clasterModel.positions[i],
                                    this._clasterModel.positions[i - 1],
                                    radius
                                );
                            }
                        } else {
                            this._clasterView.drawCircle(
                                context,
                                '',
                                'grey',
                                this._clasterModel.positions[i],
                                this._clasterModel.positions[i - 1],
                                radius
                            );
                        }
                    }

                    console.log(colorsArray)
                    console.log(this._clasterModel.positions)
                })
            })
        }
    }
}

export default ClasterController;