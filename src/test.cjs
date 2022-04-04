const _build = require("./_build.cjs")

let arr = new Uint8Array([100, 2])

let buf = Buffer.from(arr);
let arrBuf = arr.buffer
buf.toString()

console.log(buf.toString())
let result = JSON.parse(JSON.stringify({data : buf.toString()})) 
console.log(result);   