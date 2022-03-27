import Model from '../Model/Model.js';
import Controller from '../Controller/Controller.js';
import Errors from '../config/Errors.js';
import Brush from '../Model/brush.model.js';

class View {
    body: HTMLBodyElement;
    regulatorButton: HTMLButtonElement;
    regulator: HTMLDivElement;
    regulatorBar: HTMLDivElement;
    canvasDiv: HTMLDivElement;
    canvas: HTMLCanvasElement;

    constructor(body: HTMLBodyElement, regulatorButton: HTMLButtonElement, regulator: HTMLDivElement, regulatorBar: HTMLDivElement, canvasDiv: HTMLDivElement, canvas: HTMLCanvasElement, heightParagrath: HTMLParagraphElement) {
        this.body = body;
        this.regulatorButton = regulatorButton;
        this.regulator = regulator;
        this.regulatorBar = regulatorBar;
        this.canvasDiv = canvasDiv;
        this.canvas = canvas;

        this.initSliderListeners(body, regulatorButton, regulator, regulatorBar, canvasDiv, canvas, heightParagrath);
    }

    initSliderListeners(body: HTMLBodyElement, regulatorButton: HTMLButtonElement, regulator: HTMLDivElement, regulatorBar: HTMLDivElement, canvasDiv: HTMLDivElement, canvas: HTMLCanvasElement, paragraph: HTMLParagraphElement) {
        let height: number = -regulatorButton.offsetHeight - regulatorBar.offsetHeight;
        let currentHeight: number;
        let isDown: boolean = false;
        let rate: number = canvasDiv.offsetHeight / -height;

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
                canvasDiv.style.height = ((height * -1) * rate) + 'px';
                canvas.height = (height * -1) * rate;
                paragraph.innerHTML = canvas.height.toString();
                if (height >= -70) {
                    regulatorBar.style.height = '10px'
                }
                else {
                    regulatorBar.style.height = `${Math.abs(height) - 60}px`
                }
                
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