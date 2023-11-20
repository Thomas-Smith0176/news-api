const express = require('express');
const { getTopics } = require('./controllers/topics-controllers');
const app = express()

app.use(express.json())

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
    if (err) res.status(500).send({ err })
})

module.exports = app 