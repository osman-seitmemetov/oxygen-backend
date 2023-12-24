const Router = require('express');
const router = new Router();
const favoritesController = require('./favorites.controller');
const authMiddleware = require("../../middleware/auth-middleware");


router.get('/', authMiddleware, favoritesController.getFavorites);
router.post('/add', authMiddleware, favoritesController.addToFavorites);
router.post('/delete', authMiddleware, favoritesController.deleteFromFavorites);
// router.post('/', authMiddleware, favoritesController.createBasketProduct);
router.delete('/', authMiddleware, favoritesController.deleteAll);
router.delete('/:id', favoritesController.deleteOne);
router.put('/:id', authMiddleware, favoritesController.changeCount);


module.exports = router;