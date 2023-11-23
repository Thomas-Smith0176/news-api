
const db = require('../db/connection')
const format = require('pg-format')

exports.selectArticles = (topic, sort_by = 'created_at', order = 'desc', limit = 10, p = 1) => {
    let queryString = ` 
    SELECT articles.author, title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comment_id) AS INTEGER) AS comment_count 
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`;
    let queries = [];
    
    if(topic) {
        queries.push(topic);
        queryString += `
        WHERE topic = $1`;
    };

    const sortByQueries = ["title", "created_at", "author", "article_id"];

    if(sort_by && order) {
        if (sortByQueries.includes(sort_by) || order === 'asc' || order === 'desc') {
            queryString += `
            GROUP BY articles.article_id
            ORDER BY articles.${sort_by} ${order}`
        }
        else {
            return Promise.reject({status: 400, msg: 'Bad request'})
        };
    };

    queries.push(limit);
    const offset = (p - 1) * limit;
    queries.push(offset);
    queryString += `
    LIMIT $${queries.length - 1} OFFSET $${queries.length}`;
  
    return db.query(queryString, queries)
    .then((response) => {
        if (!response.rows[0]) {
            return Promise.reject({ status: 404, msg: 'Not found'})
        }
        return response.rows;
    });
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
            return Promise.reject({status: 404, msg: 'Not found'});
        };
        return response.rows[0];
    });
};

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
    });
};

exports.insertArticle = (author, title, body, topic, article_img_url) => {  
    const query = format(`
    INSERT INTO articles
    (author, title, body, topic, article_img_url, comment_count)
    VALUES 
    (%L, %L, %L, %L, %L, 0)
    RETURNING *; 
    `, author, title, body, topic, article_img_url);

    return db.query(query)
    .then((response) => {
        return response.rows[0];
    });
};

