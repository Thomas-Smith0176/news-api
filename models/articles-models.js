const db = require('../db/connection')

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