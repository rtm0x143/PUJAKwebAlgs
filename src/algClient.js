import uuidv1 from "uuid"

const algs = {
    "ant": import("./algorithms/ant"),
    "astar": import("./algorithms/astar"),
    "clasterisation": import("./algorithms/clasterisation"),
    "genetic": import("./algorithms/genetic"),
    "neuralNet": import("./algorithms/neuralNet"),
    "desicionTree": import("./algorithms/desicionTree")
}

export class Client {
    constructor() {
        this.liveSessions = []
    }

    launch(algName, args=[]) {
        if (algs[algName]) {
            const session = {id: uuidv1(), worker: algs[algName].launch(...args)}
            this.liveSessions.push(session)
            return session
        } 
        else throw "Unknown algorithm"
    }
}