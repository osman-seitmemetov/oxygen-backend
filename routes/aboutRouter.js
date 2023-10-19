const Router = require('express');
const router = new Router();
const aboutController = require('../controllers/aboutController');

router.get('/', aboutController.get);
router.put('/', aboutController.edit);


module.exports = router;