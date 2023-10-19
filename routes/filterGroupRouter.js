const Router = require('express');
const router = new Router();
const filterGroupController = require('../controllers/filterGroupController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/',  filterGroupController.create); //checkRole('ADMIN') need put in function as middleware
router.get('/', filterGroupController.getAll);
router.get('/:id', filterGroupController.getById);
router.put('/:id', filterGroupController.edit);
router.delete('/:id', filterGroupController.delete);

module.exports = router;