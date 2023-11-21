const { selectUsers } = require("../models/users-models");

exports.getUsers = (req, res, next) => {
    return selectUsers()
    .then((users) => {
        console.log(users)
        res.status(200).send({users})
    });
};