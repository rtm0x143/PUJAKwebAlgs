import AntView from "../View/ant.view";
import Controller from "./Controller.js";
import GraphModel from "../Model/graph.model";

class AntController extends Controller {
    private _graphView;
    private _graphModel;

    constructor(GraphView: AntView, GraphModel: GraphModel) {
        super();

        //classes Objects
        this._graphView = GraphView;
        this._graphModel = GraphModel;

        //set callbacks to view handlers
        this._graphView.setCoordsHandler(this.setCoords.bind(this));
        this._graphView.calcHandler(this.calcData.bind(this));
    }

    //sendCoords data to model
    setCoords(x: number, y: number) {
        this._graphModel.pushObject(x, y);
    }

    //call calculate distances in model
    calcData(antsCount: number, greedCoef: number, herdCoef: number, pherLeak: number, pointsData: string) {
        // @ts-ignore
        let buff = buffer.Buffer.from(new Uint16Array(this._graphModel.coords).buffer);
        console.log(buff);
        pointsData = buff.toString();

        let antData = {
            antsCount,
            greedCoef,
            herdCoef,
            pherLeak,
            pointsData
        }

        this._graphModel.setDistances();

        fetch(`${this.urlValue}/alg/ants/launch`, {
            method: "POST",
            body: JSON.stringify(antData)
        }).then((response) => {
            let reader = response.body?.getReader();
            reader?.read().then(({value}) => {
                console.log(value);
            })
        })
    }
}

export default AntController;