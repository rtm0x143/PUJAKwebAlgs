import {Router} from "express"
import path from "path"
import fs from "fs"

export default Router()
    .get("/:view?", (req, res) => {
        const p = path.join(req.app.get("views"), (req.params.view || "index" + ".html"))
        if (fs.existsSync(p)) {
            res.sendFile(p)
        }
        else res.sendStatus(404)
    })
    // .get("/ant", (req, res) => {

    //     res.render("ant", {
    //         title: "Ant algorithm"
    //     })
    // })
    // .get("/astar", (req, res) => {
    //     res.render("astar", {
    //         title: "A* algorithm"
    //     })
    // })
    // .get("/clasterisation", (req, res) => {
    //     res.render("clasterisation", {
    //         title: "Clasterisation algorithm"
    //     })
    // })
    // .get("/genetic", (req, res) => {
    //     res.render("genetic", {
    //         title: "Genetic algorithm"
    //     })
    // })
    // .get("/neural", (req, res) => {
    //     res.render("neural", {
    //         title: "Neural net"
    //     })
    // })
    // .get("/desicion", (req, res) => {
    //     res.render("desicion", {
    //         title: "Desicion tree"
    //     })
    // })