const db = require('../db/connection')

exports.selectUsers = () => {
    return db.query(`
    SELECT username, name, avatar_url FROM users;`)
    .then((response) => {
        return response.rows
    });
};

exports.selectUserByUsername = (username) => {
    return db.query(`
    SELECT username, name, avatar_url FROM users
    WHERE username = $1`, [username])
    .then((response) => {
        return response.rows[0]
    })
}