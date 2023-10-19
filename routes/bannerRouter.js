const Router = require('express');
const router = new Router();
const bannerController = require('../controllers/bannerController');

router.get('/', bannerController.getAll);
router.get('/:id', bannerController.getById);
router.post('/', bannerController.create);
router.delete('/', bannerController.deleteAll);
router.delete('/:id', bannerController.deleteOne);
router.put('/:id', bannerController.edit);


module.exports = router;