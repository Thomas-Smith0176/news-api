const { checkTable } = require("../utils");
const { selectCommentsByArticleId, insertComment } = require("../models/comments-models");

exports.getComments = (req, res, next) => {
    const { article_id } = req.params 
    const promises = [selectCommentsByArticleId(article_id)]

    if (article_id) {
        promises.push(checkTable("articles", "article_id", article_id))
    }
  
    Promise.all(promises)
    .then((resolvedPromises) => {
        const comments = resolvedPromises[0]
        res.status(200).send({ comments })
    })
    .catch(next);
};

exports.postComment = (req, res, next) => {
    const { body, username } = req.body
    const { article_id } = req.params
    return insertComment(body, username, Number(article_id))
    .then((comment) => {
        console.log(comment)
        res.status(201).send({comment})
    })
    .catch(next);
};