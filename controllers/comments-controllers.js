const { checkTable } = require("../utils");
const { selectCommentsByArticleId, removeComment, insertComment, updateComment } = require("../models/comments-models");

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

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params
    return removeComment(comment_id)
    .then((comment)=> {
        if (!comment) {
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        res.status(204).send()
    })
    .catch(next)
}
exports.postComment = (req, res, next) => {
    const { body, username } = req.body
    const { article_id } = req.params
    return insertComment(body, username, Number(article_id))
    .then((comment) => {
        res.status(201).send({comment})
    })
    .catch(next);
};

exports.patchComment = (req, res, next) => {
    const { comment_id } = req.params
    const { inc_votes } = req.body
    if (!inc_votes) {
        return Promise.reject({ status: 400, msg: 'Bad request'})
        .catch(next)
    }
    else {
        return updateComment(inc_votes, comment_id)
    .then((comment) => {
        if (!comment) {
            return Promise.reject({ status: 404, msg: 'Not found'})
        }
        res.status(200).send({comment})
    })
    .catch(next);
    }
};
