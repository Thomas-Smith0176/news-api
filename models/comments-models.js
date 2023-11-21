const db = require('../db/connection');

exports.selectCommentsByArticleId = (articleId) => {
    return db.query(`
    SELECT comment_id, votes, created_at, author, body, article_id 
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY created_at DESC;`, [articleId])
    .then((response) => {
        return response.rows
    });
};

exports.deleteComment = (comment_id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1;`, [comment_id])
};