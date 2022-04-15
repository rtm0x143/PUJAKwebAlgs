import GeneticView from "../View/genetic.view";
import Controller from "./Controller.js";
import GraphModel from "../Model/graph.model";
import Errors from "../config/Errors.js";

class GeneticController extends Controller {
    private _graphView;
    private _graphModel;
    private updateIntervalId: number | null = null;

    public epochCount: number = 0;

    constructor(GraphView: GeneticView, GraphModel: GraphModel) {
        super();

        //classes Objects
        this._graphView = GraphView;
        this._graphModel = GraphModel;

        //set callbacks to view handlers
        this._graphView.setCoordsHandler(this.setCoords.bind(this));

        this._graphView.launchAlgHandler(this._launchAlgHandler.bind(this));
    }

    //sendCoords data to model
    setCoords(x: number, y: number) {
        this._graphModel.pushObject(x, y);
    }

    getToken() : Promise<string | undefined> {
        // @ts-ignore
        let buff = buffer.Buffer.from(new Uint16Array(this._graphModel.coords).buffer);
        let pointsData = buff.toString("base64");

        console.log(pointsData);
        return fetch(`${this.urlValue}/alg/genetic/launch`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({pointsData: pointsData})
        }).then((response) => {
            if (response.ok) {
                return response.text();
            } 
        })
    }

    updateSimulation(token: string) {
        return fetch(`${this.urlValue}/alg/genetic/getState`, {
                method: "GET",
                headers: {
                    'Authorization': token,
                },
            }).then((response) => {
                return response.json()
            }).then((value) => {
                // @ts-ignore
                let bufferData = buffer.Buffer.from(value.path ?? Errors.handleError('undefined'));
                let pointsData = new Uint16Array(
                    bufferData.buffer,
                    bufferData.byteOffset,
                    bufferData.byteLength / 2)

                // this._graphModel.clearCanvas();

                this._graphModel.updateWay(
                    pointsData, value.cost
                );

                // console.log(pointsData, value.cost)
                console.log(++this.epochCount);
            });
    }

    async _launchAlgHandler() {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }

        let oldToken = sessionStorage.getItem('token')
        if (oldToken) {
            await fetch(`${this.urlValue}/alg/genetic/terminateSession`, {
                method: "GET",
                headers: {
                    'Authorization': oldToken
                }
            }).then(() => {
                sessionStorage.removeItem('token');
            });
        }
        
        this.getToken().then(token => {
            sessionStorage.setItem('token', token ?? Errors.handleError('undefined'));
            console.log(token);
            return token;
        })
        .then(token => {
            this.epochCount = 0
            this._graphModel.cost = Number.MAX_VALUE;   
            this.updateIntervalId = setInterval(this.updateSimulation.bind(this), 100, token);
        })
    }
}

export default GeneticController;