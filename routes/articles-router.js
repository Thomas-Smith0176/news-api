const { getArticles, getArticle, patchArticle, postArticle, deleteArticle } = require('../controllers/articles-controllers');
const { getComments, postComment } = require('../controllers/comments-controllers');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getArticles);

articlesRouter.post('/', postArticle);

articlesRouter.get('/:article_id', getArticle);

articlesRouter.patch('/:article_id', patchArticle);

articlesRouter.delete('/:article_id', deleteArticle);

articlesRouter.get('/:article_id/comments', getComments);

articlesRouter.post('/:article_id/comments', postComment);







module.exports = articlesRouter;