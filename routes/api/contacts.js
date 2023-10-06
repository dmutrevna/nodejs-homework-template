const express = require('express')
const ctrl = require('../../controllers/contacts')
const { validateBody, isValidId } = require('../../middlewares')
const schemas = require('../../schemas/contacts')

const router = express.Router()

router.get('/', ctrl.getAll)
router.get('/:id', isValidId, ctrl.getById)
router.post('/', validateBody(schemas.addSchema), ctrl.add)
router.put('/:id', validateBody(schemas.addSchema), ctrl.updateById)
router.delete('/:id', isValidId, ctrl.deleteContactById)
router.patch('/:id/favorite', isValidId, ctrl.updateStatusContact)

module.exports = router
