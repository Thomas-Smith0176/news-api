const { selectArticles, updateArticle } = require("../models/articles-models")
const { selectArticleById } = require("../models/articles-models")

exports.getArticles = (req, res, next ) => {
    const { topic } = req.query
    return selectArticles(topic)
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

exports.patchArticle = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    if (!inc_votes) {
        return Promise.reject({status: 400, msg: 'Bad request'})
        .catch(next)
    }
    else {
        return updateArticle(article_id, inc_votes)
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
    }
}

