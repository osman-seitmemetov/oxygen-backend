const Router = require('express');
const router = new Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require("../middleware/auth-middleware");
const checkRole = require('../middleware/checkRoleMiddleware');


// for user
router.get('/', authMiddleware, notificationController.getByUser); // увед. пользователя который авторизован

// for admin
router.get('/all', checkRole("ADMIN"), notificationController.getAll);
router.post('/', checkRole("ADMIN"), notificationController.create);
router.delete('/:id', checkRole("ADMIN"), notificationController.delete);
router.put('/:id'/*, checkRole("ADMIN")*/, notificationController.edit);


module.exports = router;