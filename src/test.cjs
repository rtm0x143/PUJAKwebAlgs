const _build = require("./_build.cjs")

let str = "123"

let buf = Buffer.from(str)
console.log(buf.byteOffset);
let arr = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
buf[0] = 9;

console.log(buf);
console.log(arr);