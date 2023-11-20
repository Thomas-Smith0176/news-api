const { selectArticles } = require("../models/articles-models")

exports.getArticles = (req, res, next ) => {
    return selectArticles()
    .then((articles) => {
        console.log(articles)
        res.status(200).send({articles})
    })
    .catch(next)
}