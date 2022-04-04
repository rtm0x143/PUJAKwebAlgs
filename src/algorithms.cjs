const path = require("path")
const algsDir = path.join(path.dirname(__dirname), "build", "Release")
// const algsDir = path.join(__dirname, "native")

const astar = require(path.join(algsDir, "astar")), 
    clasterisation = require(path.join(algsDir, "clasterisation")), // DBSCAN, k_means
    neuralNet = require(path.join(algsDir, "neuralNetwork")), // { init, findDigit }
    labGen = require(path.join(algsDir, "labGen")) // labGen

function _init(config = { netWeightsPath, netBiasesPath }) {
    neuralNet.init(config.netWeightsPath, config.netBiasesPath)
}

module.exports = {
    ...astar, ...clasterisation, ...labGen, findDigit : neuralNet.findDigit, init : _init
}