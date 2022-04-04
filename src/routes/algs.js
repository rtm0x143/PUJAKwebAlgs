import { Router } from "express"
import { checkQuery } from "../middlewares.js"
import pAlgs from "../pureAlgs.cjs"
//import pAlgs from "../_build.cjs"
console.log(pAlgs);

console.log(pAlgs);

export default Router()
    .post("/clasterisation", [checkQuery(["type"]), (req, res) => {
        console.log(req.query);
        if (pAlgs[req.query.type])
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
                result = pAlgs[req.query.type](...params)
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
        const result = pAlgs.labGen({height: +req.query.height, width: +req.query.width})
        res.header({
            "Content-Type": "application/octet-stream",
            "Content-Length": Object.keys(result).length * result[0].byteLength
        })
        Object.values(result).forEach(arrayBuffer => res.write(Buffer(arrayBuffer)))
        res.end()
    }]) // http://localhost:8000/alg/labgen?height=50&width=50
    .post("/astar", (req, res) => {
        if (!req.body["start"] || !req.body["end"] || !req.body["fieldData"]) res.sendStatus(400);
        
        console.log(req.body);
        let raw = Buffer.from(req.body["fieldData"])
        let fieldData = new Uint8Array(raw.buffer, raw.byteOffset, raw.byteLength)
        console.log(fieldData);

        let result = pAlgs.astar(req.body["start"], req.body["end"], 
            new Uint8Array(fieldData.buffer, fieldData.byteOffset, fieldData.byteLength));

        console.log(result);
    })