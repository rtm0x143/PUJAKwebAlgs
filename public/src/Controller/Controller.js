"use strict";
exports.__esModule = true;
var Controller = /** @class */ (function () {
    function Controller(model, newText) {
        this.model = model;
        this.newText = newText;
    }
    Controller.prototype.changeTextHandler = function (newText) {
        this.model.changeTextValue(newText.value);
    };
    Controller.prototype.handleEvent = function (e) {
        e.stopPropagation();
        switch (e.type) {
            case "click":
                this.changeTextHandler(this.newText);
                break;
        }
    };
    return Controller;
}());
exports["default"] = Controller;
//# sourceMappingURL=Controller.js.map
