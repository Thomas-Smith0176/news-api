const { checkTable } = require("../utils");
const { selectCommentsByArticleId, deleteComment } = require("../models/comments-models");

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

exports.removeComment = (req, res, next) => {
    const { comment_id } = req.params
    return deleteComment(comment_id)
    .then(()=> {
        res.status(204).send({})
    })
    .catch(next)
}