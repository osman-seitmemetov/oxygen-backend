const {
    Parameter, TypeParameter,
    Value, ProductParameterValue
} = require('../models/models');
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");
const getSuccessMessage = require("../lib/getSuccessMessage");
const getWarningMessage = require("../lib/getWarningMessage");


class ParameterController {
    async create(req, res, next) {
        try {
            const {title, type, format, values} = req.body;
            const parameter = await Parameter.create({title, type, format});

            values?.length > 0 && values.forEach(value =>
                Value.create({
                    value: value.title
                        ? JSON.stringify(value)
                        : value.value,
                    type: type,
                    parameterId: parameter.id
                })
            );

            return res.json({...parameter.dataValues, values});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {term} = req.query;
            let parameterModels = await Parameter.findAll();

            if (term) {
                parameterModels = await Parameter.findAll({
                    where: {title: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            let parameters = [];

            for (const parameterModel of parameterModels) {
                const values = await Value.findAll({where: {parameterId: parameterModel.id}});

                parameters.push({...parameterModel.dataValues, values})
            }

            return res.json(parameters.sort((a, b) => {
                if (a.title.toLowerCase() < b.title.toLowerCase()) {
                    return -1;
                }
                if (a.title.toLowerCase() > b.title.toLowerCase()) {
                    return 1;
                }
                return 0;
            }));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAllByTypeId(req, res, next) {
        try {
            const {id} = req.params;

            if (!isNaN(Number(id)) && Number(id) !== 0) {
                const typeParameters = await TypeParameter.findAll({where: {typeId: id}});
                let parameterModels = [];

                for (const typeParameter of typeParameters) {
                    parameterModels.push(await Parameter.findByPk(typeParameter.parameterId));
                }

                let parameters = [];

                for (const parameterModel of parameterModels) {
                    const values = await Value.findAll({where: {parameterId: parameterModel.id}});

                    parameters.push({...parameterModel.dataValues, values})
                }

                return res.json([...parameters].sort((a, b) => {
                    if (a.title.toLowerCase() < b.title.toLowerCase()) {
                        return -1;
                    }
                    if (a.title.toLowerCase() > b.title.toLowerCase()) {
                        return 1;
                    }
                    return 0;
                }));
            }
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            let parameter = await Parameter.findByPk(id);
            const values = await Value.findAll({where: {parameterId: parameter.id}});

            if (parameter.type === "COLOR") {
                // console.log("__WORK__");
                let parsedValues = [];
                values.forEach(value => parsedValues.push({
                    ...value.dataValues,
                    title: JSON.parse(value.value).title,
                    value: JSON.parse(value.value).value
                }));
                return res.json({...parameter.dataValues, values: parsedValues});
            }

            return res.json({...parameter.dataValues, values});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {values} = req.body;
            const {id} = req.params;

            let parameter = await Parameter.findByPk(id);

            if (values?.length > 0) {
                values.forEach(value => {
                    console.log("__id__", !value.id);
                    if (!value.id) {
                        console.log("__WORK__");
                        console.log("__JSON__", JSON.stringify({
                            value: value.title
                                ? JSON.stringify(value)
                                : value.value,
                            type: parameter.type,
                            parameterId: parameter.id
                        }));

                        return Value.create({
                            value: value.title
                                ? JSON.stringify(value)
                                : value.value,
                            type: parameter.type,
                            parameterId: parameter.id
                        })
                    }
                })

                const valueModels = await Value.findAll({where: {parameterId: parameter.id}});
                for (const valueModel of valueModels) {
                    if (!(values.find(v => v.id === valueModel.id))) {
                        const productParameterValues = await ProductParameterValue.findAll({where: {valueId: valueModel.id}});

                        if (productParameterValues.length > 0)
                            return res.json(getWarningMessage(`Значение "${valueModel.value}" имеет привязку к товару!`));
                        else await valueModel.destroy();
                    }
                }
            }

            return res.json(getSuccessMessage("Характеристика успешно изменена"));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;

            const parameter = await Parameter.findByPk(id);
            const typeParameter = await TypeParameter.findOne({where: {parameterId: parameter.id}});

            if (typeParameter) {
                return res.json(getWarningMessage(`Характеристика не может быть удалена, так как связана с типом товара!`));
            } else {
                await Value.destroy({where: {parameterId: id}});
                await parameter.destroy();
            }

            return res.json(getSuccessMessage("Характеристика успешно удалена"));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new ParameterController();