class View {
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
