const Router = require('express');
const router = new Router();
const typeController = require('../controllers/typeController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/',  typeController.create); //checkRole('ADMIN') need put in function as middleware
router.get('/', typeController.getAll);
router.get('/:id', typeController.getById);
router.put('/:id', typeController.edit);
router.delete('/:id', typeController.delete);

module.exports = router;