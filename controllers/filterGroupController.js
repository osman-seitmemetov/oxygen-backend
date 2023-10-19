const {FilterGroup, CategoryFilterGroup, FilterOption, SubcategorySecondFilterGroup} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class FilterGroupController {
    async create(req, res) {
        const {title} = req.body;
        const filterGroup = await FilterGroup.create({title});
        return res.json(filterGroup);
    }

    async getAll(req, res) {
        const {term} = req.query;
        let filterGroups = await FilterGroup.findAll();

        if (term) {
            filterGroups = await FilterGroup.findAll({
                where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
            });
        }

        return res.json(filterGroups);
    }

    async getById(req, res) {
        const {id} = req.params;
        let filterGroup = await FilterGroup.findByPk(id);

        return res.json(filterGroup);
    }

    async edit(req, res) {
        try {
            const {title} = req.body;
            const {id} = req.params;

            let filterGroup = await FilterGroup.findByPk(id);
            filterGroup.title = title;
            await filterGroup.save();

            return res.json("Категория успешно изменена");
        } catch (e) {

        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            await FilterGroup.destroy({where: {id}});

            return res.json("Категория успешно удалена");
        } catch (e) {

        }
    }
}


module.exports = new FilterGroupController();