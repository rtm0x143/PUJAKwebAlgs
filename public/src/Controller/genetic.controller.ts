import GeneticView from "../View/genetic.view";
import Controller from "./Controller.js";
import GraphModel from "../Model/graph.model";
import Errors from "../config/Errors.js";

class GeneticController extends Controller {
    private _graphView;
    private _graphModel;
    private sessionRuns: boolean = false;

    public updateInterval: number = 50;
    public epochCount: number = 0;

    constructor(GraphView: GeneticView, GraphModel: GraphModel) {
        super();

        //classes Objects
        this._graphView = GraphView;
        this._graphModel = GraphModel;

        //set callbacks to view handlers
        this._graphView.setCoordsHandler(this.setCoords.bind(this));

        this._graphView.launchAlgHandler(this._launchAlgHandler.bind(this));
        this._graphView.clearCanvasHandler(() => {
            let token = sessionStorage.getItem("token");
            if (token) {
                this.terminateSimulation(token);
            }
            this._graphModel.clearCanvas();
            this._graphModel.coords = []
        })
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

    terminateSimulation(token: string) {
        this.sessionRuns = false;
        fetch(`${this.urlValue}/alg/genetic/terminateSession`, {
            method: "GET",
            headers: {
                'Authorization': token
            }
        }).then(() => {
            sessionStorage.removeItem('token');
        });
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


                this._graphModel.updateWay(
                    pointsData, value.cost
                );
            });
    }

    async _launchAlgHandler() {
        let oldToken = sessionStorage.getItem('token')
        if (oldToken) {
            await this.terminateSimulation(oldToken);
        }
        
        this.getToken().then(token => {
            sessionStorage.setItem('token', token ?? Errors.handleError('undefined'));
            console.log(token);
            // return token;
        })
        .then(() => {
            this.epochCount = 0
            this._graphModel.cost = Number.MAX_VALUE;   
            if (!this.sessionRuns) {
                this.sessionRuns = true;
                this.updateSimulationRec();
            }
        })
    }

    private async updateSimulationRec() {
        if (!this.sessionRuns) return;

        let token = sessionStorage.getItem("token");
        
        if (!token) {
            this.sessionRuns = false;
            return;
        }

        let reqStart = Date.now();
        await this.updateSimulation(token);
        let gapTime = this.updateInterval - reqStart + Date.now();

        setTimeout(() => this.updateSimulationRec(), gapTime)
    }
}

export default GeneticController;
