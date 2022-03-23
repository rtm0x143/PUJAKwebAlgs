import IBrush from "./interface/IBrush";
import Errors from "../config/Errors";

class Brush implements IBrush {
    private _brushWidth!: number | Number;
    private _brushHeight!: number | Number;
    private _brushColor!: string | String;
    
    constructor(width?: number | Number, height?: number | Number, color?: string | String) {
        this._brushWidth = width ?? 1;
        this._brushHeight = height ?? 1;
        this._brushColor = color ?? "#CFCFCF";
    }

    // get and set for this._brushWidth
    get width(): number | Number {
        return this._brushWidth;
    }
    set width(value: number | Number) {
        this._brushWidth = value;
    }

    // get and set for this._brushHeight
    get height(): number | Number {
        return this._brushHeight;
    }
    set height(value: number | Number) {
        this._brushHeight = value;
    }

    // get and set for this._brushColor
    get color(): string | String {
        return this._brushColor;
    }
    set color(value: string | String) {
        this._brushColor = value;
    }

    get params(): Object {
        return {
            brushWidth: this._brushWidth,
            brushHeight: this._brushHeight,
            brushColor: this._brushColor
        }
    }
    set params(params: any) {
        this._brushColor = params.color;
        this._brushWidth = params.width;
        this._brushHeight = params.height;
    }
}

export default Brush;