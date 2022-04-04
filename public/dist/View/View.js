class View {
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
