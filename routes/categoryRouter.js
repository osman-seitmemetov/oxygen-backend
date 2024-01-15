const Router = require('express');
const router = new Router();
const categoryController = require('../controllers/categoryController');

router.post('/',  categoryController.create); //checkRole('ADMIN') need put in function as middleware
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.get('/children/:id', categoryController.getChildrenById);
router.put('/:id', categoryController.edit);
router.delete('/:id', categoryController.delete);

module.exports = router;