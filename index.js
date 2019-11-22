const express = require('express')
const app = express()
const dotenv = require('dotenv')
const Routes = require('./route')

dotenv.config()

let serverPort = process.env.SERVER_PORT


app.use('/', Routes)

app.listen(serverPort, () => {
    console.log('Server Is Running on Port ' + serverPort)
})