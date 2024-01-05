const Router = require('express');
const router = new Router();
const catalogGroupController = require('../controllers/catalogGroupController');

router.post('/',  catalogGroupController.create); //checkRole('ADMIN') need put in function as middleware
router.get('/', catalogGroupController.getAll);
router.get('/:id', catalogGroupController.getById);
router.put('/:id', catalogGroupController.edit);
router.delete('/:id', catalogGroupController.delete);

module.exports = router;