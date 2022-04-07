import GraphModel from "./Model/graph.model.js";
import GeneticView from "./View/genetic.view.js";
import GeneticController from "./Controller/genetic.controller.js";
import HeaderController from "./Controller/header.controller.js";
import HeaderView from "./View/header.view.js";

new HeaderController(new HeaderView());

let graphModel = new GraphModel();

new GeneticController(new GeneticView(graphModel), graphModel);