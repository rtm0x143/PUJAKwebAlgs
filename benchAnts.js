let array = new Array(1000000);

array.fill(123);

console.time();
for (let i = 0; i < 1000000; i++) {
    ++array[i];
}
console.timeEnd();

console.time();
for (let obj of array) {
    ++obj;
}
console.timeEnd();