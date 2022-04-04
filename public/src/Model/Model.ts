import IModel from "./interfaces/IModel";


class Model extends EventTarget implements IModel {
    textValue!: String

    changeTextValue(newTextValue: String): void {
        this.textValue = newTextValue;
        this.dispatchEvent(new Event('text:change'));
    }
}
export default Model;