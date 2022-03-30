class View {
    initCanvasSliderListener(size, buttonMargin, rate, body, regulatorButton, regulator, regulatorBar, canvasDiv, canvas, canvasContext, paragraph, selectedОbject) {
        //2 another params
        let currentSize;
        let isDown = false;
        regulatorButton.addEventListener('mousedown', (e) => {
            currentSize = e.clientY;
            isDown = true;
        });
        body.addEventListener('mousemove', (e) => {
            if (isDown) {
                //try to find change
                let change = currentSize - e.clientY;
                currentSize -= change;
                size += change;
                buttonMargin -= change;
                if (buttonMargin > -regulatorButton.offsetHeight) {
                    size -= change;
                    buttonMargin = -regulatorButton.offsetHeight;
                }
                if (buttonMargin < -regulator.offsetHeight) {
                    size -= change;
                    buttonMargin = -regulator.offsetHeight;
                }
                regulatorButton.style.marginTop = `${buttonMargin}px`;
                if (selectedОbject == 'height') {
                    canvasDiv.style.height = ((size * -1) * rate) + 'px';
                    canvas.height = (size * -1) * rate;
                    paragraph.innerHTML = canvas.height.toString();
                }
                else if (selectedОbject == 'width') {
                    canvasDiv.style.width = ((size * -1) * rate) + 'px';
                    canvas.width = (size * -1) * rate;
                    paragraph.innerHTML = canvas.width.toString();
                }
                else {
                    paragraph.innerHTML = Math.floor((size * -1) * rate).toString();
                }
                if (buttonMargin >= -70) {
                    regulatorBar.style.height = '10px';
                }
                else {
                    regulatorBar.style.height = `${-buttonMargin - regulatorButton.offsetHeight + 10}px`;
                }
                this.drawGrid(canvas, canvasContext, 'grey', Math.floor(canvas.width / 30), Math.floor(canvas.height / 30));
            }
        });
        body.addEventListener('mouseup', _ => {
            isDown = false;
        });
    }
    initDBSCANSliderListener(size, buttonMargin, rate, body, regulatorButton, regulator, regulatorBar, canvasDiv, canvas, canvasContext, paragraph, selectedОbject, maxValue) {
        //2 another params
        let currentSize;
        let isDown = false;
        regulatorButton.addEventListener('mousedown', (e) => {
            currentSize = e.clientY;
            isDown = true;
        });
        body.addEventListener('mousemove', (e) => {
            if (isDown) {
                //try to find change
                let change = currentSize - e.clientY;
                currentSize -= change;
                size += change;
                buttonMargin -= change;
                if (buttonMargin > -regulatorButton.offsetHeight) {
                    size = 0;
                    buttonMargin = -regulatorButton.offsetHeight;
                }
                if (buttonMargin < -regulator.offsetHeight) {
                    size = maxValue / rate;
                    buttonMargin = -regulator.offsetHeight;
                }
                regulatorButton.style.marginTop = `${buttonMargin}px`;
                regulatorBar.style.height = `${-buttonMargin - 55}px`;
                paragraph.innerHTML = Math.floor(size * rate).toString();
                if (buttonMargin >= -70) {
                    regulatorBar.style.height = `${10}px`;
                }
                // if (buttonMargin < -regulator.offsetHeight) {
                //     size -= change;
                //     buttonMargin = -regulator.offsetHeight;
                // }
            }
        });
        body.addEventListener('mouseup', _ => {
            isDown = false;
        });
    }
    // initSliderListeners(
    //     body: HTMLBodyElement, 
    //     regulatorButton: HTMLButtonElement, 
    //     regulator: HTMLDivElement, 
    //     canvasDiv: HTMLDivElement, 
    //     canvas: HTMLCanvasElement,
    // ) {
    //     //the real time size in slider
    //     let size: number = 0;
    //     let buttonMargin: number = 10;
    //     if (regulatorButton.className=="regulator__button regulator__button_height") {
    //         size = regulatorButton.offsetHeight + this.heightRegulatorBar.offsetHeight;
    //         buttonMargin = -regulatorButton.offsetHeight - this.heightRegulatorBar.offsetHeight;
    //     }
    //     else if (regulatorButton.className=="regulator__button regulator__button_width") {
    //         size = this.widthRegulatorBar.offsetHeight;
    //         buttonMargin = -regulatorButton.offsetHeight - this.widthRegulatorBar.offsetHeight;
    //     }
    //     else if (regulatorButton.className=="regulator__button regulator__button_range") {
    //         size = this.rangeRegulatorBar.offsetHeight;
    //         buttonMargin = -regulatorButton.offsetHeight - this.rangeRegulatorBar.offsetHeight;
    //     }
    //     else {
    //         size = this.countRegulatorBar.offsetHeight;
    //         buttonMargin = -regulatorButton.offsetHeight - this.rangeRegulatorBar.offsetHeight;
    //     }
    //     //2 another params
    //     let currentSize: number;
    //     let isDown: boolean = false;
    //     //k for changing size
    //     let rate: number;
    //     if (regulatorButton.className == "regulator__button regulator__button_height") {
    //         rate = canvasDiv.offsetHeight / -size;
    //     } 
    //     else if (regulatorButton.className=="regulator__button regulator__button_width") {
    //         rate = canvasDiv.offsetWidth / -size;
    //     }
    //     else if (regulatorButton.className=="regulator__button regulator__button_range") {
    //         rate = canvasDiv.offsetWidth / -size;
    //     }
    //     else {
    //         console.log(this.heightRegulator.offsetHeight);
    //         rate = 1 / ((this.heightRegulator.offsetHeight - 60) / 255);
    //     }
    //     regulatorButton.addEventListener('mousedown', (e) => {
    //         currentSize = e.clientY;
    //         isDown = true;
    //     })
    //     body.addEventListener('mousemove', (e) => {
    //         if (isDown) {
    //             //try to find change
    //             let change = currentSize - e.clientY;
    //             currentSize -= change;
    //             size += change
    //             buttonMargin -= change;
    //             if (regulatorButton.className == "regulator__button regulator__button_height") {
    //                 if (buttonMargin > -regulatorButton.offsetHeight) {
    //                     size -= change;
    //                     buttonMargin = -regulatorButton.offsetHeight;
    //                 }
    //                 if (buttonMargin < -regulator.offsetHeight) {
    //                     size -= change;
    //                     buttonMargin = -regulator.offsetHeight;
    //                 }
    //                 regulatorButton.style.marginTop = `${buttonMargin}px`;
    //                 canvasDiv.style.height = ((size * -1) * rate) + 'px';
    //                 canvas.height = (size * -1) * rate;
    //                 this.heightParagrapth.innerHTML = canvas.height.toString();
    //                 if (buttonMargin >= -70) {
    //                     this.heightRegulatorBar.style.height = '10px'
    //                 }
    //                 else {
    //                     this.heightRegulatorBar.style.height = `${Math.abs(size) - regulatorButton.offsetHeight}px`
    //                 }
    //             } 
    //             else if (regulatorButton.className == "regulator__button regulator__button_width") {
    //                 if (buttonMargin > -regulatorButton.offsetHeight) {
    //                     size -= change;
    //                     buttonMargin = -regulatorButton.offsetHeight;
    //                 }
    //                 if (buttonMargin < -regulator.offsetHeight) {
    //                     size -= change;
    //                     buttonMargin = -regulator.offsetHeight;
    //                 }
    //                 regulatorButton.style.marginTop = `${buttonMargin}px`;
    //                 canvasDiv.style.width = ((size * -1) * rate) + 'px';
    //                 canvas.width = (size * -1) * rate;
    //                 this.canvasMenu.style.width = (size * -1) * rate + 'px';
    //                 this.widthParagrapth.innerHTML = canvas.width.toString();
    //                 if (buttonMargin >= -70) {
    //                     this.widthRegulatorBar.style.height = '10px'
    //                 }
    //                 else {
    //                     this.widthRegulatorBar.style.height = `${size}px`
    //                 }
    //             }
    //             else if (regulatorButton.className == "regulator__button regulator__button_range") {
    //                 if (buttonMargin > -regulatorButton.offsetHeight) {
    //                     buttonMargin = -regulatorButton.offsetHeight;
    //                 }
    //                 if (buttonMargin < -regulator.offsetHeight) {
    //                     buttonMargin = -regulator.offsetHeight;
    //                 }
    //                 regulatorButton.style.marginTop = `${buttonMargin}px`;
    //                 if (size > this.heightRegulator.offsetHeight - 60) {
    //                     size -= change;
    //                 }
    //                 if (size < 0) {
    //                     size = 0;
    //                 }
    //                 this.rangeParagrapth.innerHTML = size.toString();
    //                 this.rangeRegulatorBar.style.height = `${size}px`;
    //                 if (size <= 10) {
    //                     this.rangeRegulatorBar.style.height = `${10}px`;
    //                 }
    //             }
    //             else {
    //                 if (buttonMargin > -regulatorButton.offsetHeight) {
    //                     buttonMargin = -regulatorButton.offsetHeight;
    //                 }
    //                 if (buttonMargin < -regulator.offsetHeight) {
    //                     buttonMargin = -regulator.offsetHeight;
    //                 }
    //                 regulatorButton.style.marginTop = `${buttonMargin}px`;
    //                 if (size * rate > 255) {
    //                     size = 255 / rate;
    //                 }
    //                 if (size * rate < 0) {
    //                     size = 0;
    //                 }
    //                 this.countParagrapth.innerHTML = Math.floor(size * rate).toString();
    //                 this.countRegulatorBar.style.height = `${size}px`;
    //                 if (size * rate <= 10) {
    //                     this.countRegulatorBar.style.height = `${10}px`;
    //                 }
    //             }
    //             this.drawGrid(this.canvasContext, 'grey', Math.floor(canvas.width / 30), Math.floor(canvas.height / 30));                
    //         }
    //     })
    //     body.addEventListener('mouseup', _ => {
    //         isDown = false;
    //     })
    // }
    drawGrid(canvas, context, color, columnCount, rowsCount) {
        context.strokeStyle = color;
        for (let i = 0; i < columnCount; ++i) {
            for (let j = 0; j < rowsCount; ++j) {
                context.strokeRect(i * canvas.width / columnCount, j * canvas.height / rowsCount, canvas.width / columnCount, canvas.height / rowsCount);
            }
        }
    }
    drawCircle(canvasContext, strokeColor, fillColor, x, y, radius) {
        canvasContext.strokeStyle = strokeColor;
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius, 0, 2 * Math.PI);
        canvasContext.stroke();
        canvasContext.fill();
    }
}
export default View;
