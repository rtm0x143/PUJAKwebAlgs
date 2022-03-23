import ICanvas from "./interface/ICanvas";
import IModel from "./interface/IModel";


class Model extends EventTarget implements IModel {
    textValue!: String

    changeTextValue(newTextValue: String): void {
        this.textValue = newTextValue;
        this.dispatchEvent(new Event('text:change'));
    }
}
export default Model;