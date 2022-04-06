import GraphView from "../View/basic.graph.view";
import Controller from "./Controller";
import GraphModel from "../Model/graph.model";

class GraphController extends Controller {
    private _graphView;
    private _model;

    constructor(GraphView: GraphView, GraphModel: GraphModel) {
        super();

        this._graphView = GraphView;
        this._model = GraphModel;
        this._graphView.setCoordsHandler(this.setCoords.bind(this));
        this._graphView.calcHandler(this.calcData.bind(this));
    }

    setCoords(x: number, y: number) {
        this._model.pushObject(x, y);
    }

    calcData() {
        this._model.setDistances();
    }
}

export default GraphController;