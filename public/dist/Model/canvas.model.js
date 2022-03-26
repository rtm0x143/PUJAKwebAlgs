class CanvasModel extends EventTarget {
    changeCanvasParams(width, height) {
        this.width = width;
        this.height = height;
        this.dispatchEvent(new Event('canvas.model:change'));
    }
}
export default CanvasModel;
