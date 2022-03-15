import {config} from "dotenv"; config()
import express from "express";
import handlebars from "express-handlebars"
import pagesRouter from "./src/routes/pages.js"

const app = express()
const hbs = handlebars.create({
    defaultLayout: "main",
    extname: "hbs"
})

app.engine("hbs", hbs.engine)
    .set("view engine", "hbs")
    .set("views", "./views")

app.use(express.json())
    .use(express.static("./public"))
    .use(pagesRouter)


const port = process.env.CONNECTION_PORT
if (!port) throw "Enviroment variable 'CONNECTION_PORT' isn't initialized"
try {

    app.listen(port, () => {
        console.log(`Server has been started on port ${port}...`)
    })
} 
catch(e) {
    console.log(e)
}