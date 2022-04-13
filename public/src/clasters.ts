import ClasterController from './Controller/canvas.claster.controller.js';
import ClasterModel from './Model/claster.model.js';
import HeaderController from "./Controller/header.controller.js";
import HeaderView from "./View/header.view.js";

new HeaderController(new HeaderView());
new ClasterController(new ClasterModel());