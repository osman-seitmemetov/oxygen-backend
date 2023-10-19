const {FilterOption} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class FilterOptionController {
    async create(req, res) {
        const {title, filterGroupId} = req.body;
        const filterOption = await FilterOption.create({title, filterGroupId});
        return res.json(filterOption);
    }

    async getAll(req, res) {
        const {term} = req.query;
        let filterOptions = await FilterOption.findAll();

        if (term) {
            filterOptions = await FilterOption.findAll({
                where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
            });
        }

        return res.json(filterOptions);
    }

    async getById(req, res) {
        const {id} = req.params;
        let filterOption = await FilterOption.findByPk(id);

        return res.json(filterOption);
    }

    async edit(req, res) {
        try {
            const {title, filterGroupId} = req.body;
            const {id} = req.params;

            let filterOption = await FilterOption.findByPk(id);
            filterOption.title = title;
            filterOption.filterGroupId = filterGroupId;
            await filterOption.save();

            return res.json("Категория успешно изменена");
        } catch (e) {

        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            await FilterOption.destroy({where: {id}});

            return res.json("Категория успешно удалена");
        } catch (e) {

        }
    }
}


module.exports = new FilterOptionController();