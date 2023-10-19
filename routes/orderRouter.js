const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth-middleware');

router.get('/', authMiddleware, orderController.getByUser);

router.get('/all', orderController.getAll);
router.get('/:id', orderController.getOne);
router.post('/', orderController.create);
router.delete('/', orderController.deleteAll);
router.delete('/:id', orderController.deleteOne);
router.put('/:id', orderController.edit);


module.exports = router;