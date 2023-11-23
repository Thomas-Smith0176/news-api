const { selectUsers, selectUser } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        res.status(200).send({users})
    });
};

exports.getUser = () => {
    return selectUser()
};