import GraphModel from "./Model/graph.model.js";
import AntView from "./View/ant.view.js";
import GraphController from "./Controller/ant.controller.js";
import HeaderController from "./Controller/header.controller.js";
import HeaderView from "./View/header.view.js";

new HeaderController(new HeaderView());

let graphModel = new GraphModel();

new GraphController(new AntView(graphModel), graphModel);