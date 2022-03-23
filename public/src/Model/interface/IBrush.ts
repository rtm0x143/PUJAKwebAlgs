export default interface IBrush {    
    get width(): number | Number;
    get height(): number | Number;
    get color(): string | String;
    get params(): Object;

    set width(width: number | Number);
    set height(height: number | Number);
    set color(color: string | String);
    set params(params: Object);
}