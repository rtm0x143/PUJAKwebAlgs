import ICanvas from "./interfaces/ICanvas";
import Brush from "./brush.model.js";

class CanvasModel extends EventTarget implements ICanvas {
    width!: number;
    height!: number;
    
    canvasEvent!: String;
    brush!: Brush;

    constructor() {
        super();
        console.log("CanvasModel initialized");
    }

    changeCanvasParams(width: number, height: number): void {
        this.width = width;
        this.height = height;
        
        this.dispatchEvent(new Event('canvas.model:change'));
    }
}

export default CanvasModel;