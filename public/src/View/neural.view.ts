import Errors from "../config/Errors";
// Какой нахуй кластер модел
import NeuralModel from '../Model/neural.model.js';
import CanvasView from './canvas.view.js';

class NeuralView extends CanvasView {
    private _model: NeuralModel;

    constructor(model: NeuralModel) {
        super(model);
        
        this._model = model;
    }
}

export default NeuralView;