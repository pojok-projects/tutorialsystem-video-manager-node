const express = require('express')
const routes = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const vidm = require('./vidm')

routes.use(bodyParser.json())
routes.use(cors())

routes.use('/vidm', vidm)

routes.all('/*', (req, res) => {
    res.status(422).send({
        code: 422,
        path: req.originalUrl,
        method: req.method,
        message: "Invalid Request"
    })
})

routes.use((error, req, res, next) => {
    return res.status(422).send({
        status: {
            code: 422,
            message: error.message,
            succeeded: false
        }
    });
})

module.exports = routes