export function checkQuery(nessusaryProps = []) {
    return (req, res, next) => {
        const query = req.query
        for (const prop of nessusaryProps) {
            if (!query[prop]) {
                if (res) {
                    res.status(400)
                    res.send("Invalid query")
                }
                return false
            }
        }
        if (next) next()
        else return true
    }
}

export function binStreamParser(req, res, next) {
    if (req.headers["content-type"] === "application/octet-stream") {
        req.body = [];
        req.on("data", data => {
            req.body.push(data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength)) 
        })
        
        req.on("end", next)
    } else next()
}