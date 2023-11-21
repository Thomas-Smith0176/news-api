const db = require('../db/connection');
const format = require('pg-format')

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

exports.insertComment = (body, username, article_id,) => {
    const created_at = new Date(Date.now())
    const query = format(`
    INSERT INTO comments
    (body, author, article_id, votes, created_at)
    VALUES
    ( %L, %L, %s, 0, %L )
    RETURNING *;`, body, username, article_id, created_at)
    return db.query(query)
    .then((response) => {
        return response.rows[0]
    })
}