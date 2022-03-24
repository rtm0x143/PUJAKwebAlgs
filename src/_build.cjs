const fs = require("fs")
const path = require("path")

const releaseDir = path.join(path.dirname(__dirname), "build", "Release")
for (let file of fs.readdirSync(releaseDir)) {
    if (path.extname(file) === ".node")
        module.exports = {...module.exports, ...require(path.join(releaseDir, file))}
} 
