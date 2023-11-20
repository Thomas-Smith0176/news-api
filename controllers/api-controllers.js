const fs = require('fs/promises')

exports.getApis = (req, res, next) => {
    return fs.readFile(`${__dirname}/../endpoints.json`)
    .then((contents) => {
        res.status(200).send({endpoints: JSON.parse(contents)})
    })
}