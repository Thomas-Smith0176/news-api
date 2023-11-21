
const db = require('../db/connection')

exports.selectArticles = () => {
    return db.query(`
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC ;
    `)
    .then((response) => {
        return response.rows
    })
};
exports.selectArticleById = (article_id) => {
    return db.query(`
    SELECT articles.author, articles.body, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comment_id) AS INTEGER) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1
    GROUP BY articles.article_id;`, [article_id])
    .then((response) => {
        if (!response.rows[0]) {
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return response.rows[0]
    })
}

