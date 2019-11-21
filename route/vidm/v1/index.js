const router = require('express').Router()
const metavideos = require('./metavideos')

router.use('/metavideos', metavideos)

module.exports = router