let {Buffer} = require("buffer")

let arr = new Uint16Array([255, 2, 3])

let buf = Buffer.from(arr.buffer),
    bStr = buf.toString("hex"),
    buf2 = Buffer.from(bStr);

let jsonData = JSON.stringify({
    cringe: 123,
    data: bStr
})

console.log(JSON.parse(jsonData));
