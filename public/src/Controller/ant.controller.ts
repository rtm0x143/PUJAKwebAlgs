import AntView from "../View/ant.view";
import Controller from "./Controller.js";
import GraphModel from "../Model/graph.model";
import Errors from "../config/Errors.js";

class AntController extends Controller {
    private _graphView;
    private _graphModel;
    private updateIntervalId: number | null = null;

    constructor(GraphView: AntView, GraphModel: GraphModel) {
        super();

        //classes Objects
        this._graphView = GraphView;
        this._graphModel = GraphModel;

        //set callbacks to view handlers
        this._graphView.setCoordsHandler(this.setCoords.bind(this));
        // this._graphView.launchAlgHandler(this.getToken.bind(this));
        this._graphView.launchAlgHandler(this._launchAlgHandler.bind(this));
    }

    //sendCoords data to model
    setCoords(x: number, y: number) {
        this._graphModel.pushObject(x, y);
    }

    //call calculate distances in model
    getToken(settings: {
            antsCount: number | undefined,
            greedCoef: number | undefined,
            herdCoef: number | undefined,
            pherLeak: number | undefined,
            [index: string]: any
        } | undefined) : Promise<string | undefined> {
        // @ts-ignore
        let buff = buffer.Buffer.from(new Uint16Array(this._graphModel.coords).buffer);
        let pointsData = buff.toString("base64");

        /*console.log(this._graphModel.coords);
        console.log(buff);*/

        let antData = {}
        if (settings) {
            Object.keys(settings).forEach(key => {
                antData = {...antData, key: settings[key]}
            }) 
        }
        antData = {
            ...antData,
            pointsData,
        }

        // console.log(antData);
        return fetch(`${this.urlValue}/alg/ants/launch`, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(antData)
        }).then((response) => {
            if (response.ok) {
                return response.text();
            } 
        })
    }

    updateSimulation(token: string) {
        return fetch(`${this.urlValue}/alg/ants/getState`, {
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

                console.log(/*pointsData,*/ value.cost)
            });
    }

    async _launchAlgHandler(colonySettings: any) {
        if (this.updateIntervalId) {
            clearInterval(this.updateIntervalId);
            this.updateIntervalId = null;
        }

        let oldToken = sessionStorage.getItem('token')
        if (oldToken) {
            await fetch(`${this.urlValue}/alg/ants/terminateSession`, {
                method: "GET",
                headers: {
                    'Authorization': oldToken
                }
            }).then(() => {
                sessionStorage.removeItem('token');
            });
        }
        
        this.getToken(colonySettings).then(token => {
            sessionStorage.setItem('token', token ?? Errors.handleError('undefined'));
            console.log(token);
            return token;
        })
        .then(token => {
            this._graphModel.cost = Number.MAX_VALUE;
            this.updateIntervalId = setInterval(this.updateSimulation.bind(this), 500, token);
        })
    }
}

export default AntController;