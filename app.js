const express = require("express");
const apiRouter = require('./routes/api-router');
const { handleErrors } = require('./errors');
const cors = require('cors');

const app = express()

app.use(cors());

app.use(express.json())

app.use("/api", apiRouter)

app.use(handleErrors)

module.exports = app 