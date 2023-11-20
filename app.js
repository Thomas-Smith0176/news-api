const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getArticle } = require('./controllers/articles-controllers');
const { getApis } = require('./controllers/api-controllers');
const app = express()

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);
app.get('/api', getApis);

app.get('/api/*', (req, res) => {
    return res.status(404).send({msg: '404: Not found'})
});

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: 'Bad request'})
    };
    if(err.status) {
        res.status(err.status).send({msg: err.msg})
    };
});

module.exports = app 