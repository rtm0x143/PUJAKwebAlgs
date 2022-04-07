import AntView from "../View/ant.view";
import Controller from "./Controller.js";
import GraphModel from "../Model/graph.model";
import {response} from "express";
import * as Buffer from "buffer";

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
    calcData(antsCount: number, greedCoef: number, herdCoef: number, pherLeak: number) {
        let data = new FormData();

        let antData = {
            antsCount: antsCount,
            greedCoef: greedCoef,
            herdCoef: herdCoef,
            pherLeak: pherLeak
        }

        let buff = new Buffer.from(new Uint16Array<number>(this._graphModel.coords))

        data.append("json", JSON.stringify(antData));
        this._graphModel.setDistances();

        fetch(`${this.urlValue}`, {
            method: "POST",
            body: data
        }).then((response) => {
            //...
        })
    }
}

export default AntController;