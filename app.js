const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getArticle, patchArticle } = require('./controllers/articles-controllers');
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

app.post('/api/articles/:article_id/comments', postComment);

app.patch('/api/articles/:article_id', patchArticle);

app.get('/api/*', (req, res) => {
    return res.status(404).send({msg: '404: Not found'})
});

app.use((err, req, res, next) => {
    console.log(err)
    const psqlCodes = ['22P02', '42703']
    if (err.code === '22P02' || err.code === '42703') {
        res.status(400).send({msg: 'Bad request'})
    };
    if (err.code === '23503') {
        res.status(404).send({msg: 'Not found'})
    }
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    };
});

module.exports = app 