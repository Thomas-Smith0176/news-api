const { selectUsers, selectUser } = require("../models/users-models");
const { selectUsers, selectUserByUsername } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({users})
    });
};

exports.getUserByUsername = (req, res, next) => {
    const { username } = req.params
    return selectUserByUsername(username)
    .then((user) => {
        console.log(user)
        if(!user) {
            return Promise.reject({status: 404, msg: 'Not found'})
        }
        res.status(200).send({user})
    })
    .catch(next);
};