const { response } = require("../app")
const { selectArticles, updateArticle, insertArticle, removeArticleById } = require('../models/articles-models')
const { selectArticleById } = require('../models/articles-models')
const { totalEntries } = require('../utils')

exports.getArticles = (req, res, next ) => {
    const { author, topic, sort_by, order, limit, p } = req.query
    const promises = []
    promises.push(selectArticles(author, topic, sort_by, order, limit, p))
    promises.push(totalEntries("articles"))

    Promise.all(promises)
    .then(([articles, total_count]) => {
        res.status(200).send({articles, total_count})
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
        return Promise.reject({status: 400, msg: "Bad request"})
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

exports.postArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body
    return insertArticle(author, title, body, topic, article_img_url)
    .then((article) => {
        res.status(201).send({article})
    })
    .catch(next)
}

exports.deleteArticle = (req, res, next) => {
    const { article_id } = req.params
    return removeArticleById(article_id)
    .then((article) => {
        if (!article) {
            return Promise.reject({status: 404, msg: "Not found"})
        }
        res.status(204).send()
    })
    .catch(next);
};
