const Router = require('express');
const router = new Router();
const articleController = require('../controllers/articleController');

router.get('/', articleController.getAll);
router.get('/:id', articleController.getOne);
router.post('/', articleController.create);
router.delete('/', articleController.deleteAll);
router.delete('/:id', articleController.deleteOne);
router.put('/:id', articleController.edit);


module.exports = router;