export function collisionCheck(points, height, width) {
    for (const point of points) {
        if (
            +point["x"] < 0 || +point["x"] >= +width ||
            +point["y"] < 0 || +point["y"] >= +height
        ) return false
    }

    return true
}