const db = require("../db/connection");
const format = require("pg-format")

exports.selectCommentsByArticleId = (articleId, limit = 10, p = 1) => {
    const offset = (p - 1) * limit

    return db.query(`
    SELECT comment_id, votes, created_at, author, body, article_id 
    FROM comments
    WHERE comments.article_id = $1
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3;`, [articleId, limit, offset])
    .then((response) => {
        return response.rows
    });
};

exports.removeComment = (comment_id) => {
    return db.query(`
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *;`, [comment_id])
    .then((response) => {
        return response.rows[0]
    })
};

exports.insertComment = (body, username, article_id,) => {
    const query = format(`
    INSERT INTO comments
    (body, author, article_id)
    VALUES
    ( %L, %L, %s)
    RETURNING *;`, body, username, article_id)
    return db.query(query)
    .then((response) => {
        return response.rows[0]
    })
}

exports.updateComment = (inc_votes, comment_id) => {
    return db.query(`
    UPDATE comments
    SET votes = comments.votes + $1
    WHERE comment_id = $2
    RETURNING *;`, [inc_votes, comment_id]
    )
    .then((response) => {
        return response.rows[0]
    })
}
