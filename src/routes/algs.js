import { Router, application } from "express"
import { checkQuery } from "../middlewares.js"
import nAlgs from "../algorithms.cjs"

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
                console.log("Algorithm internal Error!\n", error);
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
        if (!req.body["start"] || !req.body["end"] || !req.body["fieldData"] ||
            !req.body["height"], !req.body["width"]) res.sendStatus(400);
        
        let raw = Buffer.from(req.body["fieldData"])

        let result = new Uint8Array(nAlgs.astar(
                req.body["start"], 
                req.body["end"], 
                { width: req.body["width"], height: req.body["height"] },
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
        
        res.send(nAlgs.findDigit(req.body[0]).toString())
    })