import GraphModel from "./Model/graph.model.js";
import GraphView from "./View/graph.view.js";
import GraphController from "./Controller/graph.controller.js";

let graphModel = new GraphModel();

new GraphController(new GraphView(graphModel), graphModel);