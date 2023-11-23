const express = require('express');
const apiRouter = require('./routes/api-router');
const { handleErrors } = require('./errors');

const app = express()

app.use(express.json())

app.use('/api', apiRouter)

app.use(handleErrors)

module.exports = app 