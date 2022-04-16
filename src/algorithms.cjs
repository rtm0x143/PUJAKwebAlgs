const path = require("path")
const algsDir = path.join(path.dirname(__dirname), "build", "Release")
// const algsDir = path.join(__dirname, "native")

const astar = require(path.join(algsDir, "astar")), 
    clasterisation = require(path.join(algsDir, "clasterisation")), // DBSCAN, k_means
    neuralNet = require(path.join(algsDir, "neuralNetwork")),       // { init, findDigit }
    labGen = require(path.join(algsDir, "labGen")),                 // labGen
    ants = require(path.join(algsDir, "ants")),                     // { launch, getNextEpoch, hasSession, terminateSession }
    genetic = require(path.join(algsDir, "genetic"))                // { launch, getNextEpoch, hasSession, terminateSession }

module.exports = {
    ...astar, ...clasterisation, ...labGen, neuralNet, ants, genetic
}