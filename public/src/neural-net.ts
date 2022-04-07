import NeuralController from "./Controller/neural.controller.js";
import NeuralModel from "./Model/neural.model.js";
import NeuralView from "./View/neural.view.js";

let neuralModel = new NeuralModel();

new NeuralController(new NeuralView(neuralModel), neuralModel);
