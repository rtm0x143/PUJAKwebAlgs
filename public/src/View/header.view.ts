import Errors from "../config/Errors.js";
import CanvasView from "./canvas.view";

class HeaderView {
    private _overlay: HTMLDivElement = document.querySelector('#navigation-screen')
        ?? Errors.handleError('null');
    private _navTrigger: HTMLDivElement = document.querySelector('#nav-trigger')
        ?? Errors.handleError('null');
    private _navClose: HTMLDivElement = document.querySelector('#nav-close')
        ?? Errors.handleError('null');

    openMenuHandler(callback: Function) {
        this._navTrigger.addEventListener('click', () => {
            callback(this._overlay);
        })
    }

    closeMenuHandler(callback: Function) {
        this._navClose.addEventListener('click', () => {
            callback(this._overlay);
        })
    }
}

export default HeaderView;