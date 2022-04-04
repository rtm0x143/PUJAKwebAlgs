const _build = require("./_build.cjs")

let a = 33;
let b = a >> 2
console.log(b);

// const array = new Uint16Array([1, 2, 3, 4])
// fetch("http://localhost:8000/alg/clasterisation?type=DBSCAN&range=2&gSize=2", {
//     method: "POST",
//     headers: {
//         "Content-Type": "application/octet-stream"
//     },
//     body: array.buffer
// }).then(res => {
//     res.body.getReader().read().then(data => console.log(data));
// })