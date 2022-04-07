let t = require("jsonwebtoken")

let q = t.sign("qwe", "1")
console.log(t.decode(q)); 

let arr = new Uint8Array([1, 2, 1, 2, 3, 4])

let buf = Buffer.from(Buffer.from(arr.buffer).toString())

console.log(new Uint16Array(buf.buffer, buf.byteOffset, buf.byteLength / 2));  