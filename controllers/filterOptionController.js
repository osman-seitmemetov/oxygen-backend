const {FilterOption} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class FilterOptionController {
    async create(req, res, next) {
        try {
            const {title, filterGroupId} = req.body;
            const filterOption = await FilterOption.create({title, filterGroupId});
            return res.json(filterOption);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {term} = req.query;
            let filterOptions = await FilterOption.findAll();

            if (term) {
                filterOptions = await FilterOption.findAll({
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            return res.json(filterOptions);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            let filterOption = await FilterOption.findByPk(id);

            return res.json(filterOption);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {title, filterGroupId} = req.body;
            const {id} = req.params;

            let filterOption = await FilterOption.findByPk(id);
            filterOption.title = title;
            filterOption.filterGroupId = filterGroupId;
            await filterOption.save();

            return res.json("Категория успешно изменена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await FilterOption.destroy({where: {id}});

            return res.json("Категория успешно удалена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new FilterOptionController();