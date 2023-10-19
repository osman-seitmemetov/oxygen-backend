const Router = require('express');
const router = new Router();
const promocodeController = require('../controllers/promocodeController');
const authMiddleware = require("../middleware/auth-middleware");
const checkRole = require('../middleware/checkRoleMiddleware');


// for user
// router.get('/', authMiddleware, promocodeController.getByUser);

// for admin
router.get('/', promocodeController.getAll);
router.get('/:id', promocodeController.getById);
router.post('/', promocodeController.create);
router.delete('/:id', promocodeController.delete);
router.put('/:id', promocodeController.edit);


module.exports = router;