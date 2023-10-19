const Router = require('express');
const router = new Router();
const FAQController = require('../controllers/FAQController');

router.get('/', FAQController.getAll);
router.get('/:id', FAQController.getOne);
router.post('/group', FAQController.createGroup);
router.post('/item', FAQController.createItem);
router.delete('/group/:id', FAQController.deleteGroup);
router.delete('/item/:id', FAQController.deleteItem);
router.put('/group/:id', FAQController.editGroup);
router.put('/item/:id', FAQController.editItem);


module.exports = router;