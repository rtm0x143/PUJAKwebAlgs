import { Router } from "express"
import { checkQuery, binStreamParser } from "./routeTools.js"
// import pAlgs from "../pureAlgs.cjs"
import pAlgs from "../_build.cjs"

export default Router()
    .use(binStreamParser)
    .post("/clasterisation", [checkQuery(["type"]), (req, res) => {
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
                console.log("My Error!\n", error);
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