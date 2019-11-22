const router = require('express').Router()
const metavideos = require('../../../controller/metavideosController')

//  Routes
router.post('/store/:id', metavideos.validate('store'), metavideos.store)
router.post('/update', metavideos.validate('update'), metavideos.update)
router.post('/delete', metavideos.validate('update'), metavideos.delete)
router.get('/:id', metavideos.get)

module.exports = router