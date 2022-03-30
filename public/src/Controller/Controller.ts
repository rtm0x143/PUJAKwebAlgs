import Model from '../Model/Model.js';

class Controller {
    urlValue: string = location.origin;
    hsvToRGB(h: number, s: number, v: number) {
        /// Parametres for convert 
        /// C = V * S
        /// X = C * |(1 - H / 60 % 2 - 1|)
        /// m = V - C

        /// R'G'B'
        /// (C, X, 0)  <--- 0 degr   <= H < 60 degr
        /// (X, C, 0)  <--- 60 degr  <= H < 120 degr
        /// (0, C, X)  <--- 120 degr <= H < 180 degr
        /// (0, X, C)  <--- 180 degr <= H < 240 degr
        /// (X, 0, C)  <--- 240 degr <= H < 300 degr
        /// (C, 0, X)  <--- 300 degr <= H < 360 degr
        ///R'G'B' ---> (R, G, B) === ((R'+m)*255, (G'+m)*255, (B'+m)*255)
        if (h < 60) {
            return `rgb(${(v * s + v - v * s) * 255},${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},0)`;
        }
        else if (h < 120) {
            return `rgb(${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},${(v * s + v - v * s) * 255},0)`;
        }
        else if (h < 180) {
            return `rgb(0,${(v * s + v - v * s) * 255},${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255})`;
        }
        else if (h < 240) {
            return `rgb(0,${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},${(v * s + v - v * s) * 255})`;
        }
        else if (h < 300) {
            return `rgb(${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255},0, ${(v * s + v - v * s) * 255})`;
        }
        else if (h < 360) {
            return `rgb(${(v * s + v - v * s) * 255},0,${(v * s * Math.abs(1 - (h / 60) % 2 - 1) + v - v * s) * 255})`;
        }

        return ''
    }
}

export default Controller;
//# sourceMappingURL=Controller.js.map