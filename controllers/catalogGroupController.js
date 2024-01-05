const {CatalogGroup, Category, CatalogItem} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");
const getSuccessMessage = require("../lib/getSuccessMessage");

class CatalogGroupController {
    async create(req, res, next) {
        try {
            const {title, link, order, catalogItems} = req.body;
            const catalogGroup = await CatalogGroup.create({title, link, order});

            catalogItems.forEach(c => CatalogItem.create({
                title: c.title, link: c.link, img: c.img, order: c.order
            }))

            return res.json(catalogGroup);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {term, limit, page} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            let catalogGroups = []

            let catalogGroupModels = await CatalogGroup.findAll({
                order: [['title', 'ASC']],
                limit, offset
            });

            if (term) {
                catalogGroupModels = await CatalogGroup.findAll({
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}},
                    order: [['title', 'ASC']],
                    limit, offset
                })
            }

            for (const catalogGroupModel of catalogGroupModels) {
                const catalogItems = await CatalogItem.findAll({where: {catalogGroupId: catalogGroupModel.id}})
                catalogGroups.push({...catalogGroupModel.dataValues, catalogItems})
            }

            return res.json(catalogGroups)
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            const catalogGroup = await CatalogGroup.findByPk(id);
            const catalogItems = await CatalogItem.findAll({where: {catalogGroupId: catalogGroup.id}})

            return res.json({...catalogGroup.dataValues, catalogItems});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {title, link, order, catalogItems} = req.body;
            const {id} = req.params;

            let catalogGroup = await CatalogGroup.findByPk(id);
            catalogGroup.title = title;
            catalogGroup.link = link;
            catalogGroup.order = order;
            await catalogGroup.save();

            await CatalogItem.destroy({where: {catalogGroupId: catalogGroup.id}})

            catalogItems.forEach(c => CatalogItem.create({
                title: c.title, link: c.link, img: c.img, order: c.order
            }))

            return res.json(getSuccessMessage("Группа элементов каталога успешно изменена"));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await CatalogGroup.destroy({where: {id}});
            await CatalogItem.destroy({where: {catalogGroupId: id}})

            return res.json(getSuccessMessage("Группа элементов каталога успешно удалена"));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new CatalogGroupController();