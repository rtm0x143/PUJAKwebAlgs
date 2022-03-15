import {Router} from "express"

export default Router()
    .get("/", (req, res) => {
        res.render("home", {
            title: "Algs by PUJAK"
        })
    })
    .get("/ant", (req, res) => {
        res.render("ant", {
            title: "Ant algorithm"
        })
    })
    .get("/astar", (req, res) => {
        res.render("astar", {
            title: "A* algorithm"
        })
    })
    .get("/clasterisation", (req, res) => {
        res.render("clasterisation", {
            title: "Clasterisation algorithm"
        })
    })
    .get("/genetic", (req, res) => {
        res.render("genetic", {
            title: "Genetic algorithm"
        })
    })
    .get("/neural", (req, res) => {
        res.render("neural", {
            title: "Neural net"
        })
    })
    .get("/desicion", (req, res) => {
        res.render("desicion", {
            title: "Desicion tree"
        })
    })