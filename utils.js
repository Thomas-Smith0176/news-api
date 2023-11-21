const db = require('./db/connection')
const format = require('pg-format')

exports.checkTable = (table, column, value) => {
    const query = format(`
    SELECT * FROM %I
    WHERE %I = $1;`, table, column)
    return db.query(query, [value])
    .then((response) => {
        if (!response.rows[0]) {
            return Promise.reject({ status: 404, msg: 'Not found' })
        }
    })
}