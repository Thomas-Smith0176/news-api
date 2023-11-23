const apiRouter = require('express').Router();
const { getApis } = require('../controllers/api-controllers');
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter.get('/', getApis);

apiRouter.use('/articles', articlesRouter);

apiRouter.use('/topics', topicsRouter);

apiRouter.use('/users', usersRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.get('/*', (req, res) => {
    return res.status(404).send({msg: '404: Not found'})
})

module.exports = apiRouter;