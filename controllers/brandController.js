const {
    Parameter, Brand, TypeBrand
} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class ParameterController {
    async create(req, res, next) {
        try {
            const {name, description, logo, typeIds} = req.body;
            const brand = await Brand.create({name, description, logo});

            typeIds.forEach(typeId =>
                TypeBrand.create({
                    typeId: typeId,
                    brandId: brand.id,
                })
            );

            return res.json({...brand.dataValues, typeIds});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {term} = req.query;
            let brands = await Brand.findAll();

            if (term) {
                brands = await Parameter.findAll({
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            return res.json([...brands].sort((a, b) => {
                if (a.name.toLowerCase() < b.name.toLowerCase()) {
                    return -1;
                }
                if (a.name.toLowerCase() > b.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            }));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {

            const {id} = req.params;
            const brand = await Brand.findByPk(id);
            const typeBrands = await TypeBrand.findAll({where: {brandId: id}});

            let typeIds = [];

            typeBrands.forEach(typeBrand =>
                typeIds.push(typeBrand.typeId)
            );

            return res.json({...brand.dataValues, typeIds});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {name, description, logo, typeIds} = req.body;
            const {id} = req.params;

            let brand = await Brand.findByPk(id);
            brand.name = name;
            brand.description = description;
            brand.logo = logo;
            await brand.save();

            await TypeBrand.destroy({where: {brandId: brand.id}});

            typeIds.forEach(typeId =>
                TypeBrand.create({
                    typeId: typeId,
                    brandId: brand.id,
                })
            );

            return res.json("Характеристика успешно изменена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            await Brand.destroy({where: {id}});

            await TypeBrand.destroy({where: {brandId: id}});

            return res.json("Характеристика успешно удалена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new ParameterController();