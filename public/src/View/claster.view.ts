import Errors from '../config/Errors.js';
//import Brush from '../Model/brush.model.js';
import ClasterModel from '../Model/claster.model.js';
import CanvasView from './canvas.view.js';

class ClasterView extends CanvasView {
    private _regulatorButton: HTMLButtonElement;
    private currentAlg: string = 'DBSCAN';

    private _DBSCANButton: HTMLButtonElement;
    private _kmeansButton: HTMLButtonElement;
    private _sendButton: HTMLButtonElement;

    private _clasterModel: ClasterModel;
    private readonly body: HTMLBodyElement;
    private readonly regulatorButtons: NodeListOf<HTMLButtonElement>;
    private readonly widthRegulator: HTMLDivElement;
    private readonly heightRegulator: HTMLDivElement;
    private readonly heightRegulatorBar: HTMLDivElement;
    private readonly widthRegulatorBar: HTMLDivElement;
    private readonly rangeRegulatorBar: HTMLDivElement;
    private readonly countRegulatorBar: HTMLDivElement;
    private readonly heightParagraph: HTMLParagraphElement;
    private readonly widthParagraph: HTMLParagraphElement;
    private readonly rangeParagraph: HTMLParagraphElement;
    private readonly countParagraph: HTMLParagraphElement;
    private readonly kmeansSelect: HTMLSelectElement;
    private countInput: HTMLInputElement;
    private canvasMenu: HTMLDivElement;
    private readonly kmeansMenu: HTMLDivElement;

    constructor(model: ClasterModel) {
        super(model);

        this.body = document.querySelector('body') ?? Errors.handleError('null');
        this.regulatorButtons = document.querySelectorAll('.regulator__button') ?? Errors.handleError('null');
        this.heightRegulator = document.querySelector('.regulator__width-param') ?? Errors.handleError('null');
        this.widthRegulator = document.querySelector('.regulator__height-param') ?? Errors.handleError('null');
        this.heightRegulatorBar = document.querySelector('.regulator__bar_height') ?? Errors.handleError('null');
        this.widthRegulatorBar = document.querySelector('.regulator__bar_width') ?? Errors.handleError('null');
        this.rangeRegulatorBar = document.querySelector('.regulator__bar_range') ?? Errors.handleError('null');
        this.countRegulatorBar = document.querySelector('.regulator__bar_count') ?? Errors.handleError('null');
        this.heightParagraph = document.querySelector('.regulator__height-paragraph') ?? Errors.handleError('null');
        this.widthParagraph = document.querySelector('.regulator__width-paragraph') ?? Errors.handleError('null');
        this.rangeParagraph = document.querySelector('.regulator__range-paragraph') ?? Errors.handleError('null');
        this.countParagraph = document.querySelector('.regulator__count-paragraph') ?? Errors.handleError('null');
        this.kmeansSelect = document.querySelector('.kmeans-menu__select') ?? Errors.handleError('null');
        this.countInput = document.querySelector('.kmeans-menu__input input') ?? Errors.handleError('null');
        this.canvasMenu = document.querySelector('.canvas__menu') ?? Errors.handleError('null');
        this.kmeansMenu = document.querySelector('.kmeans-menu') ?? Errors.handleError('null');

        //Elements fo change canvas
        this._regulatorButton = document.querySelector('.regulator__button') ?? Errors.handleError('null');

        // //buttons to send on server data
        this._DBSCANButton = document.querySelector('.canvas__menu-button_DBSCAN')
            ?? Errors.handleError('null');
        this._kmeansButton = document.querySelector('.canvas__menu-button_kmeans')
            ?? Errors.handleError('null');
        this._sendButton =  document.querySelector('.canvas__menu-button_send')
            ?? Errors.handleError('null');

        //Models
        this._clasterModel = model;
        
        //starts with DBSCAN
        this.kmeansMenu.style.display = 'none';
        this._subscribe();
        this.canvas.setAttribute('height', this.canvasWrapper.offsetHeight.toString());
        this.canvas.setAttribute('width', this.canvasWrapper.offsetWidth.toString());
        this.regulatorButtons.forEach((item) => {
            if (item.className == "regulator__button regulator__button_height") {
                this.changeCanvasSize(
                    item.offsetHeight + this.heightRegulatorBar.offsetHeight,
                    -item.offsetHeight - this.heightRegulatorBar.offsetHeight,
                    this.canvasWrapper.offsetHeight / -(item.offsetHeight + this.heightRegulatorBar.offsetHeight),
                    this.body,
                    item,
                    this.heightRegulator,
                    this.heightRegulatorBar,
                    this.canvasWrapper,
                    this.canvas,
                    this.canvasContext,
                    this.heightParagraph,
                    'height'
                )
            }
            else if (item.className == "regulator__button regulator__button_width") {
                if (this.currentAlg === 'DBSCAN') {
                    this.changeCanvasSize(
                        item.offsetHeight + this.widthRegulatorBar.offsetHeight,
                        -item.offsetHeight - this.widthRegulatorBar.offsetHeight,
                        this.canvasWrapper.offsetWidth / -(item.offsetHeight + this.widthRegulatorBar.offsetHeight),
                        this.body,
                        item,
                        this.widthRegulator,
                        this.widthRegulatorBar,
                        this.canvasWrapper,
                        this.canvas,
                        this.canvasContext,
                        this.widthParagraph,
                        'width'
                    )
                }
            }
            else if (item.className == "regulator__button regulator__button_range") {
                this.changeDBSCANSParams(
                    this.rangeRegulatorBar.offsetHeight,
                    -item.offsetHeight - this.rangeRegulatorBar.offsetHeight,
                    1.5,
                    this.body,
                    item,
                    this.widthRegulator,
                    this.rangeRegulatorBar,
                    this.canvasWrapper,
                    this.canvas,
                    this.canvasContext,
                    this.rangeParagraph,
                    'range',
                    960
                )
            }
            else if (item.className == "regulator__button regulator__button_count") {
                this.changeDBSCANSParams(
                    this.countRegulatorBar.offsetHeight,
                    -item.offsetHeight - this.rangeRegulatorBar.offsetHeight,
                    1 / ((this.heightRegulator.offsetHeight - 60) / 255),
                    this.body,
                    item,
                    this.widthRegulator,
                    this.countRegulatorBar,
                    this.canvasWrapper,
                    this.canvas,
                    this.canvasContext,
                    this.countParagraph,
                    'count',
                    255
                )
            }
        })
        
        this.drawGrid(
            'grey',
            Math.floor(this.canvas.width / 30),
            Math.floor(this.canvas.height / 30)
        );
    }

    changeCanvasSize(
        size: number,
        buttonMargin: number,
        rate: number,
        body: HTMLBodyElement,
        regulatorButton: HTMLButtonElement,
        regulator: HTMLDivElement,
        regulatorBar: HTMLDivElement,
        canvasDiv: HTMLDivElement,
        canvas: HTMLCanvasElement,
        canvasContext: CanvasRenderingContext2D,
        paragraph: HTMLParagraphElement,
        selectedObject: string
    ) {
        //2 another params
        let currentSize: number;
        let isDown: boolean = false;

        regulatorButton.addEventListener('mousedown', (e) => {
            currentSize = e.clientY;
            isDown = true;
        })

        body.addEventListener('mousemove', (e) => {
            if (isDown) {
                //try to find change
                let change = currentSize - e.clientY;
                currentSize -= change;
                size += change
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

                if (selectedObject == 'height') {
                    canvasDiv.style.height = ((size * -1) * rate) + 'px';
                    canvas.height = (size * -1) * rate;
                    paragraph.innerHTML = canvas.height.toString();
                }
                else if (selectedObject == 'width') {
                    canvasDiv.style.width = ((size * -1) * rate) + 'px';
                    canvas.width = (size * -1) * rate;
                    paragraph.innerHTML = canvas.width.toString();
                }
                else {
                    paragraph.innerHTML = Math.floor((size * -1) * rate).toString();
                }

                if (buttonMargin >= -70) {
                    regulatorBar.style.height = '10px'
                }
                else {
                    regulatorBar.style.height = `${-buttonMargin - regulatorButton.offsetHeight + 10}px`
                }

                this.drawGrid(
                    'grey',
                    Math.floor(canvas.width / 30),
                    Math.floor(canvas.height / 30)
                );
            }
        })

        body.addEventListener('mouseup', _ => {
            if (isDown) {
                isDown = false;
                this._clasterModel.positions = [];
            }
        })
    }

    changeDBSCANSParams(
        size: number,
        buttonMargin: number,
        rate: number,
        body: HTMLBodyElement,
        regulatorButton: HTMLButtonElement,
        regulator: HTMLDivElement,
        regulatorBar: HTMLDivElement,
        canvasDiv: HTMLDivElement,
        canvas: HTMLCanvasElement,
        canvasContext: CanvasRenderingContext2D,
        paragraph: HTMLParagraphElement,
        selectedObject: string,
        maxValue: number
    ) {
        //2 another params
        let currentSize: number;
        let isDown: boolean = false;

        regulatorButton.addEventListener('mousedown', (e) => {
            currentSize = e.clientY;
            isDown = true;
        })

        body.addEventListener('mousemove', (e) => {
            if (isDown) {
                //try to find change
                let change = currentSize - e.clientY;
                currentSize -= change;
                size += change
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
            }
        })

        body.addEventListener('mouseup', _ => {
            isDown = false;
        })
    }

    getMousePosition(event: MouseEvent): Object {
        return {
            x: event.offsetX,
            y: event.offsetY
        }
    }

    handleButtonClick(callback: Function) {
        return this.canvas.addEventListener('click', (event) => {
            event.preventDefault();
            callback(this.getMousePosition(event));
        });
    }

    _subscribe() {
        this._clasterModel.addEventListener('claster.model:addObj', () => {
            this.drawCircle(
                '',
                'red', 
                {
                    x: this._clasterModel.positions[this._clasterModel.positions.length - 1],
                    y: this._clasterModel.positions[this._clasterModel.positions.length - 2],
                },
                5
        )});

        this._canvasModel.addEventListener('canvas.model:change', () => {
            this.drawGrid(
                'grey', 
                Math.floor(this.canvas.width / 30),
                Math.floor(this.canvas.height / 30)
            );
        });
    }

    handleKmeansClick(callback: Function) {
        this._kmeansButton.addEventListener('click', (event) => {
            event.preventDefault();
            callback(this.kmeansMenu);
        });
    }

    handleFetch(callback: Function) {
        this._sendButton.addEventListener('click', (event) => {
            event.preventDefault();
            callback(
                getComputedStyle(this.kmeansMenu).display,
                parseInt(this.rangeParagraph.textContent ?? Errors.handleError('null')),
                parseInt(this.countParagraph.textContent ?? Errors.handleError('null')),
                this.kmeansSelect.value ?? Errors.handleError('null'),
                parseInt(this.countInput.value ?? Errors.handleError('null')),
                10
            );
        });
    }
}

export default ClasterView;
