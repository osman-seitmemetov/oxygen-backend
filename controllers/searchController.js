const uuid = require('uuid');
const path = require('path');
const {Product, ProductInfo, BasketProduct, Category} = require('../models/models');
const ApiError = require('../error/ApiError');
const fs = require("fs");
const {Sequelize} = require("sequelize");
const Op = Sequelize.Op;

class ProductController {
    async getAll(req, res, next) {
        try {
            let {limit, page, term} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let items = {};

            if (term) {
                const products = await Product.findAll({
                    limit, offset,
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });

                const categories = await Category.findAll({
                    limit, offset,
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });

                items = {
                    products: [...products],
                    categories: [...categories]
                }
            }

            return res.json(items);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new ProductController();