const Router = require('express');
const router = new Router();
const productController = require('../controllers/productController');

router.post('/', productController.create);
router.get('/', productController.getAll);
router.get('/main', productController.getMain);
router.get('/:id', productController.getById);
router.delete('/:id', productController.delete);
router.put('/:id', productController.edit);

module.exports = router;