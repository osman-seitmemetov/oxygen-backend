const Router = require('express');
const router = new Router();
const basketController = require('../controllers/basketController');
const authMiddleware = require("../middleware/auth-middleware");


router.get('/', authMiddleware, basketController.getBasket);
router.post('/add', authMiddleware, basketController.addToBasket);
router.post('/delete', authMiddleware, basketController.deleteFromBasket);
router.post('/', authMiddleware, basketController.createBasketProduct);
router.delete('/', authMiddleware, basketController.deleteAll);
router.delete('/:id', basketController.deleteOne);
router.put('/:id', authMiddleware, basketController.changeCount);


module.exports = router;