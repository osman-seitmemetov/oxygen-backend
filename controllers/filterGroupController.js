const {FilterGroup, CategoryFilterGroup, FilterOption, SubcategorySecondFilterGroup} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class FilterGroupController {
    async create(req, res, next) {
        try {
            const {title} = req.body;
            const filterGroup = await FilterGroup.create({title});
            return res.json(filterGroup);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {term} = req.query;
            let filterGroups = await FilterGroup.findAll();

            if (term) {
                filterGroups = await FilterGroup.findAll({
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            return res.json(filterGroups);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            let filterGroup = await FilterGroup.findByPk(id);

            return res.json(filterGroup);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {title} = req.body;
            const {id} = req.params;

            let filterGroup = await FilterGroup.findByPk(id);
            filterGroup.title = title;
            await filterGroup.save();

            return res.json("Категория успешно изменена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await FilterGroup.destroy({where: {id}});

            return res.json("Категория успешно удалена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new FilterGroupController();