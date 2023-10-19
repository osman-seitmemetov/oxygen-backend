const {
    Parameter, Brand, TypeBrand
} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class ParameterController {
    async create(req, res) {
        const {name, description, logo, typeIds} = req.body;
        const brand = await Brand.create({name, description, logo});

        typeIds.forEach(typeId =>
            TypeBrand.create({
                typeId: typeId,
                brandId: brand.id,
            })
        );

        return res.json({...brand.dataValues, typeIds});
    }

    async getAll(req, res) {
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
    }

    async getById(req, res) {
        const {id} = req.params;
        const brand = await Brand.findByPk(id);
        const typeBrands = await TypeBrand.findAll({where: {brandId: id}});

        let typeIds = [];

        typeBrands.forEach(typeBrand =>
            typeIds.push(typeBrand.typeId)
        );

        return res.json({...brand.dataValues, typeIds});
    }

    async edit(req, res) {
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

        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            await Brand.destroy({where: {id}});

            await TypeBrand.destroy({where: {brandId: id}});

            return res.json("Характеристика успешно удалена");
        } catch (e) {

        }
    }
}


module.exports = new ParameterController();