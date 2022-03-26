class Controller {
    constructor(model, newText) {
        this.model = model;
        this.newText = newText;
    }
    changeTextHandler(newText) {
        this.model.changeTextValue(newText.value);
    }
    handleEvent(e) {
        e.stopPropagation();
        switch (e.target.className) {
            case "text_change":
                this.changeTextHandler(this.newText);
                break;
        }
    }
}
export default Controller;
//# sourceMappingURL=Controller.js.map
