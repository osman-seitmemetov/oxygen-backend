const Router = require('express');
const router = new Router();
const filterOptionController = require('../controllers/filterOptionController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/',  filterOptionController.create); //checkRole('ADMIN') need put in function as middleware
router.get('/', filterOptionController.getAll);
router.get('/:id', filterOptionController.getById);
router.put('/:id', filterOptionController.edit);
router.delete('/:id', filterOptionController.delete);

module.exports = router;