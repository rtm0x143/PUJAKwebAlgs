import Model from '../Model/Model.js';
import Controller from '../Controller/Controller.js';
import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';

class View {
    private _model: Model;
    private _brush: Brush;
    private _controller: Controller;
    private _el: HTMLElement;
    private _p: HTMLElement;
    private _button: HTMLInputElement;
    private _canvasEvent!: String;

    constructor() {
        ///
        ///--- declare htmlElement and check if it is nullable
        ///
        this._el = document.querySelector('.text_change') ?? Errors.handleError("null");
        this._p = document.querySelector('.text') ?? Errors.handleError("null");
        this._button = document.querySelector('.sendButton') ?? Errors.handleError("null");
        ///
        ///

        this._model = new Model();
        this._brush = new Brush();
        this._controller = new Controller(this._model, (<HTMLInputElement>document.getElementById('p_input')));
        //
        // The this._controller implements the handleEvent method so there is no need to write lambda
        // or pass a function as an argument
        //
        this._el.addEventListener('click', this._controller);
        this._button.addEventListener('click', this._controller);
        // The lambda function is used here so as not to lose the context
        this._model.addEventListener('text:change', () => this._subscribeParagraph());
    }

    _subscribeParagraph() {
        if (this._p) {
            this._p.innerHTML = this._model.textValue.toString();
        }
    }
}

export default View;