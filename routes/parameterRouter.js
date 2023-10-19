const Router = require('express');
const router = new Router();
const parameterController = require('../controllers/parameterController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/',  parameterController.create); //checkRole('ADMIN') need put in function as middleware
router.get('/', parameterController.getAll);
router.get('/type/:id', parameterController.getAllByTypeId);
router.get('/:id', parameterController.getById);
router.put('/:id', parameterController.edit);
router.delete('/:id', parameterController.delete);

module.exports = router;