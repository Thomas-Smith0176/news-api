const db = require('../db/connection')

exports.selectArticles = () => {
    console.log('in model')
    return db.query(`
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC ;
    `)
    .then((response) => {
        console.log(response.rows)
        return response.rows
    })
};