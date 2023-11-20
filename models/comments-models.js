const db = require('../db/connection');

exports.selectCommentsByArticleId = (articleId) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body, article_id 
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY created_at DESC;`, [articleId])
    .then((response) => {
        if (!response.rows[0]) {
            return Promise.reject({status: 404, msg: 'Not found'})
        };
        return response.rows
    });
};