import { config } from "dotenv"; config()
import { Router } from "express"
import { checkQuery } from "../middlewares.js"
import { collisionCheck } from "../../utils/tools.js"
import jwt from "jsonwebtoken"
import nAlgs from "../algorithms.cjs"

function simLaunch(sim) {
    return (req, res) => {
        if (!req.body["pointsData"]) {
            res.sendStatus(400);
            return
        }
        let data = Buffer.from(req.body["pointsData"], "base64")
        let pointsData = new Uint16Array(data.buffer, data.byteOffset, data.byteLength / 2)
        let id = sim.launch(pointsData, req.body)

        // console.log("From launch with", sim, " created ", id);

        jwt.sign(id, process.env["jwtSecret"], (err, token) => {
            // console.log(jwt.decode(token), token, "created");
            if (err) {
                console.log(err)
                res.sendStatus(500)
                return
            }
            res.send(token);
        })}
}

function graphSimGetState(sim) {
    return (req, res) => {
        let token = req.header("Authorization")
        // if (!token) {
        //     res.sendStatus(401)
        //     return
        // }
        jwt.verify(token, process.env.jwtSecret, (err, payload) => {
            // console.log("requested", sim, "with", payload);
            if (!err && sim.hasSession(payload)) 
            {
                let result = sim.getNextEpoch(payload);
                res.json({
                    cost: result.cost,
                    path: Buffer.from(result.path.buffer).toString()
                })
            } 
            else {
                res.sendStatus(401)
            }
        })}
}

function simTerminate(sim) {
    return (req, res) => {
        let token = req.header("Authorization")
        // if (!token) {
        //     res.sendStatus(401)
        //     return
        // }
        jwt.verify(token, process.env.jwtSecret, (err, payload) => {
            if (!err && sim.hasSession(payload)) {
                // console.log("Trying to delete", sim, "with", payload);
                sim.terminateSession(payload)
                // console.log(payload, "deleted");
                res.sendStatus(200)
            } 
            else {
                res.sendStatus(401)
            }
        })
    }
}

function createGraphSimRouter(sim) {
    return Router()
        .post("/launch", simLaunch(sim))
        .get("/getState", graphSimGetState(sim))
        .get("/terminateSession", simTerminate(sim))
}   

const antsRouter = createGraphSimRouter(nAlgs.ants)
const geneticRouter = createGraphSimRouter(nAlgs.genetic)



export default Router()
    .post("/clasterisation", [checkQuery(["type"]), (req, res) => {
        if (nAlgs[req.query.type]) 
        {
            const params = [new Uint16Array(req.body[0])]
            if (req.query.type === "k_means") 
            {
                if (checkQuery(["pCount", "metric"])(req)) {
                    params.push(+req.query.pCount, req.query.metric)
                    if (req.query.cCount) params.push(+req.query.cCount)
                } 
                else return
            } 
            else if (req.query.type === "DBSCAN") 
            {
                if (checkQuery(["range", "gSize"])(req)) {
                    params.push(+req.query.range, +req.query.gSize)
                } 
                else return
            } 
            else {
                res.status(400)
                res.send("Invalid algorithm type")
                return
            }

            let result
            try {
                result = nAlgs[req.query.type](...params)
            } catch (error) {
                // console.log("Algorithm internal Error!\n", error);
                res.status(400)
                res.send(error.toString())
                return
            }

            res.header({
                "Content-Type": "application/octet-stream",
                "Content-Length": result.byteLength
            })
            res.write(result)
            res.end()
        } else {
            res.status(400)
            res.send("Invalid algorithm type")
        }
    }])
    .get("/labgen", [checkQuery(["height", "width"]), (req, res) => {
        const result = nAlgs.labGen({height: +req.query.height, width: +req.query.width})
        res.header({
            "Content-Type": "application/octet-stream",
            "Content-Length": Object.keys(result).length * result[0].byteLength
        })
        Object.values(result).forEach(arrayBuffer => res.write(Buffer(arrayBuffer)))
        res.end()
    }]) // http://localhost:8000/alg/labgen?height=50&width=50
    .post("/astar", (req, res) => {
        if (!req.body["start"] || !req.body["end"] || !req.body["field"]) res.sendStatus(400);
        if (!collisionCheck([req.body["start"], req.body["end"]], req.body["field"]["height"], req.body["field"]["width"])) res.sendStatus(400);

        let field = req.body["field"]
        let raw = Buffer.from(field["data"])
        let result = new Uint8Array(nAlgs.astar(
                req.body["start"], 
                req.body["end"], 
                { width: field["width"], height: field["height"] },
                new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength)));

        res.setHeader("Content-Type", "application/octet-stream")
        res.setHeader("Content-Lenght", result.length)
        res.write(result)
        res.end()
    })
    .post("/neuralNet", (req, res) => {
        if (req.header("content-type") !== "application/octet-stream") res.sendStatus(400)
        if (+req.header("Content-Length") !== 10000) {
            res.status(400)
            res.send("Invalid stream dimension")
        }
        
        res.send(nAlgs.neuralNet.findDigit(req.body[0]).toString())
    })
    .use("/ants", antsRouter)
    .use("/genetic", geneticRouter)