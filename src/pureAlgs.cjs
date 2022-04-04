module.exports = {
    ...require("./native/astar"), 
    ...require("./native/clasterisation"), // DBSCAN, k_means
    neuralNet: require("./native/neuralNetwork"), // { init, feedForward }
    ...require("./native/labGen") // labGen
}