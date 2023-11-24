const fs = require("fs/promises")

exports.getApis = (req, res, next) => {
    const endpoints = require("../endpoints.json")
    res.status(200).send({endpoints})
}