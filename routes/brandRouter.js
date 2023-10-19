const Router = require('express');
const router = new Router();
const brandController = require('../controllers/brandController');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/',  brandController.create); //checkRole('ADMIN') need put in function as middleware
router.get('/', brandController.getAll);
router.get('/:id', brandController.getById);
router.put('/:id', brandController.edit);
router.delete('/:id', brandController.delete);

module.exports = router;