const { selectArticles } = require("../models/articles-models")
const { selectArticleById } = require("../models/articles-models")

exports.getArticles = (req, res, next ) => {
    return selectArticles()
    .then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getArticle = (req, res, next) => {
    const { article_id } = req.params
    return selectArticleById(article_id)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch(next);
}

