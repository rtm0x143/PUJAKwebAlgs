import Model from '../Model/Model.js';
import Controller from '../Controller/Controller.js';
import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';

class View {
    body: HTMLBodyElement;
    regulatorButton: HTMLButtonElement;
    regulator: HTMLDivElement;

    constructor(body: HTMLBodyElement, regulatorButton: HTMLButtonElement, regulator: HTMLDivElement) {
        this.body = body;
        this.regulatorButton = regulatorButton;
        this.regulator = regulator;

        this.initSliderListeners(body, regulatorButton, regulator);
    }

    initSliderListeners(body: HTMLBodyElement, regulatorButton: HTMLButtonElement, regulator: HTMLDivElement) {
        let height: number = -60;
        let currentHeight: number;
        let isDown: boolean = false;

        regulatorButton.addEventListener('mousedown', (e) => {
            currentHeight = e.clientY;
            isDown = true;
        })

        body.addEventListener('mousemove', (e) => {
            if (isDown) {
                let change = currentHeight - e.clientY;
                currentHeight -= change;
                height -= change
                
                if (height > -60) {
                    height = -60;
                }

                if (height < -regulator.offsetHeight) {
                    height = -regulator.offsetHeight;
                }

                regulatorButton.style.marginTop = `${height}px`;
            }
        })

        body.addEventListener('mouseup', _ => {
            isDown = false;
        })
    }

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