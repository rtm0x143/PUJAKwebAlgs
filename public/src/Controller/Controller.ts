import Model from '../Model/Model.js';

class Controller {
    model: Model;
    newText: HTMLInputElement;
    
    constructor(model: Model, newText: HTMLInputElement) {
        this.model = model;
        this.newText = newText;
    }

    changeTextHandler(newText: HTMLInputElement) {
        this.model.changeTextValue(newText.value);
    }

    handleEvent(e: Event) {
        e.stopPropagation();
        switch ((<HTMLTextAreaElement>e.target).className) {
            case "text_change":
                this.changeTextHandler(this.newText);
                break;
        }
    }
}

export default Controller;
//# sourceMappingURL=Controller.js.map