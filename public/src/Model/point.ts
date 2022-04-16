class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other: Point): boolean {
        if (this.x === other.x && this.y === other.y) return true;

        return false;
    }
}

export default Point;