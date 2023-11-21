const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getArticle } = require('./controllers/articles-controllers');
const { getApis } = require('./controllers/api-controllers');
const { getComments, postComment } = require('./controllers/comments-controllers');
const { getArticles } = require('./controllers/articles-controllers');
const app = express()

app.use(express.json())

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

app.get('/api', getApis);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id/comments', getComments);

app.get('/api/*', (req, res) => {
    return res.status(404).send({msg: '404: Not found'})
});

app.post('/api/articles/:article_id/comments', postComment);

app.use((err, req, res, next) => {
    const psqlCodes = ['22P02', '23503', '42703']
    if (psqlCodes.includes(err.code)) {
        res.status(400).send({msg: 'Bad request'})
    };
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    };
});

module.exports = app 