const {Product} = require("../../models/models");
const {DataTypes} = require("sequelize");
const {Sequelize} = require("sequelize");
const ApiError = require("../../error/ApiError");
const Op = Sequelize.Op;


class SearchController {
    async getResult(req, res, next) {
        try {
            let {term, page, limit} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            let products = await Product.findOne({where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}, limit, offset});

            res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new SearchController();