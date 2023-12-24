const authMiddleware = require("../../middleware/auth-middleware");
const searchController = require("./search.controller");
const Router = require("express");
const router = new Router();

router.get('/', searchController.getResult);


module.exports = router;