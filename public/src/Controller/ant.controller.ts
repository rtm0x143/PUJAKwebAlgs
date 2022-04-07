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
    calcData() {
        this._graphModel.setDistances();
        console.log(this._graphModel.distances)
    }
}

export default AntController;