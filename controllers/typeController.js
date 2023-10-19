const {Type, TypeParameter} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class typeController {
    async create(req, res) {
        const {name, parameterIds, categoryId} = req.body;
        const type = await Type.create({name, categoryId});

        parameterIds?.length > 0 && parameterIds.forEach(parameterId =>
            TypeParameter.create({
                typeId: type.id,
                parameterId: parameterId
            })
        );

        return res.json({...type.dataValues, parameterIds});
    }

    async getAll(req, res) {
        const {term} = req.query;
        let types = await Type.findAll();

        if (term) {
            types = await Type.findAll({
                where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
            });
        }

        return res.json([...types].sort((a, b) => {
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
        let type = await Type.findByPk(id);
        const typeParameters = await TypeParameter.findAll({where: {typeId: type.id}});
        let parameterIds = [];

        typeParameters.forEach(typeParameter => parameterIds.push(typeParameter.parameterId));

        return res.json({...type.dataValues, parameterIds});
    }

    async edit(req, res) {
        try {
            const {name, parameterIds, categoryId} = req.body;
            const {id} = req.params;

            let type = await Type.findByPk(id);
            type.name = name;
            type.categoryId = categoryId;
            await type.save();

            await TypeParameter.destroy({where: {typeId: type.id}});

            parameterIds?.length > 0 && parameterIds.forEach(parameterId =>
                TypeParameter.create({
                    typeId: type.id,
                    parameterId: parameterId
                })
            );

            return res.json("Тип товара успешно изменен");
        } catch (e) {

        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            await Type.destroy({where: {id}});

            await TypeParameter.destroy({where: {typeId: id}});

            return res.json("Тип товара успешно удален");
        } catch (e) {

        }
    }
}


module.exports = new typeController();