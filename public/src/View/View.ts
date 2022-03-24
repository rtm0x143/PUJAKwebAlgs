import Model from '../Model/Model.js';
import Controller from '../Controller/Controller.js';
import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';

class View {
    drawCircle(canvasContext: CanvasRenderingContext2D, strokeColor: string, fillColor: string, x: number, y: number, radius: number) {
        canvasContext.strokeStyle = strokeColor;
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
        canvasContext.stroke();
        canvasContext.fill();
    }
}

export default View;