module.exports = {
    // ...require("./native/astar"), 
    ...require("./native/clasterisation"), // DBSCAN, k_means
    neuralNet: require("./native/neuralNet"), // { init, feedForward }
    ...require("./native/labGen") // labGen
}