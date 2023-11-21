const { checkTable } = require("../utils");
const { selectCommentsByArticleId } = require("../models/comments-models");

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