import ClasterController from './Controller/canvas.claster.controller.js';
import CanvasController from './Controller/canvas.controller.js';
import CanvasModel from './Model/canvas.model.js';
import ClasterModel from './Model/claster.model.js';
import CanvasAstarView from './View/canvas.astar.view.js';

let canvasModel = new CanvasModel();
let clasterModel = new ClasterModel();

new CanvasController(canvasModel);
let c = new CanvasAstarView(canvasModel);
c.drawGrid()

new ClasterController(clasterModel);