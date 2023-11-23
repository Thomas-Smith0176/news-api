const { getArticles, getArticle, patchArticle } = require('../controllers/articles-controllers');
const { getComments, postComment } = require('../controllers/comments-controllers');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

articlesRouter.get('/:article_id', getArticle);

articlesRouter.get('/:article_id/comments', getComments);

articlesRouter.post('/:article_id/comments', postComment);

articlesRouter.patch('/:article_id', patchArticle);


module.exports = articlesRouter;