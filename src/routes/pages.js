import {Router} from "express"

export default Router()
    .get("/", (req, res) => {
        res.render("home", {
            title: "Algs by PUJAK"
        })
})