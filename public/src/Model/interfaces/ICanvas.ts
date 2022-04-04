import Brush from "../brush.model";

export default interface ICanvas {
    width: Number;
    height: Number;
    
    canvasEvent: String;
    brush: Brush;

    changeCanvasParams(width: number, height: number): void;
}
