
const db = require('../db/connection')

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc') => {
    let queryString = ` 
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`
    let queries = []
    
    if(topic) {
        queries.push(topic)
        queryString += `
        WHERE topic = $1`
    }

    const sortByQueries = ["title", "created_at", "author", "article_id"]

    if(sort_by && order) {
        if (sortByQueries.includes(sort_by) || order === 'asc' || order === 'desc') {
            queryString += `
            GROUP BY articles.article_id
            ORDER BY articles.${sort_by} ${order} ;`
        }
        else {
            return Promise.reject({status: 400, msg: 'Bad request'})
        }
    }

    return db.query(queryString, queries)
    .then((response) => {
        if (!response.rows[0]) {
            return Promise.reject({ status: 404, msg: 'Not found'})
        }
        return response.rows
    })
};

exports.selectArticleById = (article_id) => {
    return db.query(`
    SELECT * FROM articles 
    WHERE article_id = $1;`, [article_id])
    .then((response) => {
        if (!response.rows[0]) {
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        return response.rows[0]
    })
}

exports.updateArticle = (article_id, inc_votes) => {
    return db.query(`
    UPDATE articles
    SET votes = articles.votes + $1
    WHERE article_id = $2
    RETURNING *;`, [inc_votes, article_id]
    )
    .then((response) => {
        if (!response.rows[0]) {
            return Promise.reject({ status: 404, msg: 'Not found'})
        };
        return response.rows[0];
    })
}

