const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getArticle } = require('./controllers/articles-controllers');
const app = express()

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticle);

app.get('/api/*', (req, res) => {
    return res.status(404).send({msg: '404: Not found'})
});

module.exports = app 