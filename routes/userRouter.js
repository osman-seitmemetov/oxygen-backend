const Router = require('express');
const userController =  require('../controllers/userController');
const router = new Router();
const authMiddleware = require('../middleware/auth-middleware');
const checkRole = require('../middleware/checkRoleMiddleware');
const {body} = require('express-validator');


router.get('/promocode', authMiddleware, userController.getPromocodes);
router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration
);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', userController.getUsers);
router.get('/:id', userController.getUserById);
router.put('/edit', authMiddleware, userController.editProfile);
router.put('/edit/:id', checkRole("ADMIN"), userController.editUser);
// router.put('/change_password', authMiddleware, userController.changePassword);

module.exports = router