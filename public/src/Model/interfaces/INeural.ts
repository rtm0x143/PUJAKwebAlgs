interface INeural {
    coords: Array<number>;
    answer: string;
    addCoords(x: number, y: number, flag: boolean): void
}

export default INeural;