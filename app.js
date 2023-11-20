const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const { getApis } = require('./controllers/api-controllers');
const { getArticles } = require('./controllers/articles-controllers');
const app = express()

app.get('/api/topics', getTopics);

app.get('/api', getApis);

app.get('/api/articles', getArticles);

app.get('/api/*', (req, res) => {
    return res.status(404).send({msg: '404: Not found'})
})


module.exports = app 