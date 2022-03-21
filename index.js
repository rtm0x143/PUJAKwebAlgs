import { config } from "dotenv"; config()
import path from "path"
import url from "url"
import express from "express";
// import handlebars from "express-handlebars"
import pagesRouter from "./src/routes/pages.js"
import algsRouter from "./src/routes/algs.js"
import { binStreamParser } from "./src/middlewares.js"

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const app = express()
// const hbs = handlebars.create({
//     defaultLayout: "main",
//     extname: "hbs"
// })

// app.engine("hbs", hbs.engine)
//     .set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"))

app.use(express.json())
    .use(express.static(path.join(__dirname, "public")))
    .use(binStreamParser)
    .use(pagesRouter)
    .use("/alg", algsRouter)


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