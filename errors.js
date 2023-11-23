exports.handleErrors = (err, req, res, next) => {
    const psqlCodes = ['22P02', '42703']
    if (psqlCodes.includes(err.code)) {
        res.status(400).send({msg: 'Bad request'})
    };
    if (err.code === '23503') {
        res.status(404).send({msg: 'Not found'})
    }
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    };
}