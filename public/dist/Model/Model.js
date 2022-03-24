class Model extends EventTarget {
    changeTextValue(newTextValue) {
        this.textValue = newTextValue;
        this.dispatchEvent(new Event('text:change'));
    }
}
export default Model;
