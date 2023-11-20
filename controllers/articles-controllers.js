const { selectArticles } = require("../models/articles-models")

exports.getArticles = (req, res, next ) => {
    return selectArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}