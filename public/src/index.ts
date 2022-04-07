import CanvasController from './Controller/canvas.controller.js';
import CanvasModel from './Model/canvas.model.js';
import ClasterController from './Controller/canvas.claster.controller.js';
import ClasterModel from './Model/claster.model.js';
let canvasModel = new CanvasModel();
let clasterModel = new ClasterModel();

new CanvasController(canvasModel);

new ClasterController(clasterModel);