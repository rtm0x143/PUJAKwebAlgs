import ClasterModel from "../Model/claster.model";
import CanvasClasterView from "../View/canvas.claster.js";

class ClasterController {
    private _clasterView: CanvasClasterView;
    private _clasterModel: ClasterModel;

    constructor(clasterModel: ClasterModel) {
        this._clasterModel = clasterModel;
        this._clasterView = new CanvasClasterView(this._clasterModel);
        this._clasterView.handleButtonClick(this.AddObjectCalback.bind(this));
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
                
            })
            
        })
    }

    requestKMeans() {

    }
}

export default ClasterController;