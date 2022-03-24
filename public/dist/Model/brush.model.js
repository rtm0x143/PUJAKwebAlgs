class Brush {
    constructor(width, height, color) {
        this._brushWidth = width !== null && width !== void 0 ? width : 1;
        this._brushHeight = height !== null && height !== void 0 ? height : 1;
        this._brushColor = color !== null && color !== void 0 ? color : "#CFCFCF";
    }
    // get and set for this._brushWidth
    get width() {
        return this._brushWidth;
    }
    set width(value) {
        this._brushWidth = value;
    }
    // get and set for this._brushHeight
    get height() {
        return this._brushHeight;
    }
    set height(value) {
        this._brushHeight = value;
    }
    // get and set for this._brushColor
    get color() {
        return this._brushColor;
    }
    set color(value) {
        this._brushColor = value;
    }
    get params() {
        return {
            brushWidth: this._brushWidth,
            brushHeight: this._brushHeight,
            brushColor: this._brushColor
        };
    }
    set params(params) {
        this._brushColor = params.color;
        this._brushWidth = params.width;
        this._brushHeight = params.height;
    }
}
export default Brush;
