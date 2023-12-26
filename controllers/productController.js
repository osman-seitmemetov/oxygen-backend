// const uuid = require('uuid');
// const path = require('path');
const {
    Product, ProductParameter, Parameter, ProductParameterColorValue, ProductParameterTextValue,
    ProductParameterNumberValue, ColorValue, TextValue, NumberValue, ProductParameterBooleanValue, BooleanValue,
    Category, ProductParameterValue, Value
} = require('../models/models');
const ApiError = require('../error/ApiError');
const fs = require("fs");
const {Sequelize} = require("sequelize");
const Op = Sequelize.Op;
const getSuccessMessage = require("../lib/getSuccessMessage");
const getWarningMessage = require("../lib/getWarningMessage");

class ProductController {
    async create(req, res, next) {
        try {
            let {
                name, description, price, count, categoryId, info, isDiscount, newPrice,
                img, typeId, brandId, buyCount
            } = req.body;

            const product = await Product.create({
                name, price: Number(price), count: Number(count),
                img, description, newPrice: newPrice ? Number(newPrice) : null, isDiscount, categoryId, typeId,
                brandId, buyCount
            });

            if (info && info.length !== 0) {
                for (const i of info) {
                    const parameter = await Parameter.findByPk(i.parameterId);

                    const productParameter = await ProductParameter.create({
                        parameterId: i.parameterId,
                        productId: product.id
                    })

                    if (parameter.format === "CHECKBOX") {
                        for (const valueId of i.valueIds) {
                            await ProductParameterValue.create({
                                productParameterId: productParameter.id,
                                valueId: valueId
                            })
                        }
                    }

                    if (parameter.format === "RADIO") {
                        await ProductParameterValue.create({
                            productParameterId: productParameter.id,
                            valueId: i.valueId
                        })
                    }

                    if (parameter.format === "INPUT" && i.value) {
                        const value = await Value.create({
                            type: parameter.type,
                            value: i.value.title
                                ? JSON.stringify(i.value)
                                : i.value.value,
                        });

                        await ProductParameterValue.create({
                            productParameterId: productParameter.id,
                            valueId: value.id
                        })
                    }
                }
            }

            return res.json({...product.dataValues, info});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {categoryId, limit, page, priceMin, priceMax, term, typeIds, brandIds, parameters} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;

            console.log("__parameters__", parameters)


            let products = await Product.findAll({limit, offset});

            if (term) {
                products = await Product.findAll({
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            if (categoryId && !isNaN(categoryId)) {
                const category = await Category.findByPk(categoryId);
                if (category.lvl === 3) {
                    products = await Product.findAll({limit, offset, where: {categoryId}});
                } else if (category.lvl === 2) {
                    const category3Lvls = await Category.findAll({where: {parentId: categoryId}});
                    let productsTemp = [];

                    for (const category3Lvl of category3Lvls) {
                        const productsByCategory = await Product.findAll({
                            limit,
                            offset,
                            where: {categoryId: category3Lvl.id}
                        });

                        productsByCategory.forEach(productByCategory => productsTemp.push(productByCategory));
                    }
                    products = productsTemp;
                } else if (category.lvl === 1) {
                    const category2Lvls = await Category.findAll({where: {parentId: categoryId}});
                    let productsTemp = [];

                    for (const category2Lvl of category2Lvls) {
                        const category3Lvls = await Category.findAll({where: {parentId: category2Lvl.id}});

                        for (const category3Lvl of category3Lvls) {
                            const productsByCategory = await Product.findAll({
                                limit,
                                offset,
                                where: {categoryId: category3Lvl.id}
                            });

                            productsByCategory.forEach(productByCategory => productsTemp.push(productByCategory));
                        }
                    }

                    products = productsTemp;
                }

                if (brandIds && JSON.parse(brandIds).length > 0) {
                    let productsTemp = [];
                    JSON.parse(brandIds).forEach(brandId => {
                        products.filter(product => product.brandId === brandId)
                            .forEach(product => productsTemp.push(product));
                    })
                    products = productsTemp;
                }

                if (typeIds && JSON.parse(typeIds).length > 0) {
                    let productsTemp = [];
                    JSON.parse(typeIds).forEach(typeId => {
                        products.filter(product => product.typeId === typeId)
                            .forEach(product => productsTemp.push(product));
                    })
                    products = productsTemp;
                }
            }

            if (priceMax && priceMin) {
                products = products.filter(product => {
                    return product.newPrice
                        ? product.newPrice >= Number(priceMin) && product.newPrice <= Number(priceMax)
                        : product.price >= Number(priceMin) && product.price <= Number(priceMax)
                });
            }

            if (parameters) {
                let sortedProducts = []

                for (const p of parameters) {
                    console.log("__PP___", p)
                    const productParameters = await ProductParameter.findAll({where: {parameterId: p.parameterId}})

                    for (const productParameter of productParameters) {
                        const productParameterValues = await ProductParameterValue.findAll({where: {productParameterId: productParameter.id}})

                        for (const productParameterValue of productParameterValues) {
                            const value = await Value.findOne({where: {id: productParameterValue.valueId}})

                            if (p.format === 'INPUT') {
                                if (p.value === value) sortedProducts.push(products.find(product => product.id === productParameter.productId).dataValues);
                            }
                        }
                    }
                }

                console.log('sortedProducts', sortedProducts)
            }

            return res.json(products);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            const product = await Product.findByPk(id);
            const productParameters = await ProductParameter.findAll({where: {productId: product.id}});
            console.log("_1_productParameters__", productParameters);

            let info = [];

            for (const productParameter of productParameters) {
                const parameter = await Parameter.findByPk(productParameter.parameterId);
                console.log("_2_parameter__", parameter);
                const productParameterValues = await ProductParameterValue.findAll({where: {productParameterId: productParameter.id}});
                console.log("_3_productParameterValues__", productParameterValues);

                let valueIds = [];
                let valueId = null;
                let value = null;

                if (parameter.format === "CHECKBOX") {
                    console.log("CHECKBOX");
                    for (const productParameterValue of productParameterValues) {
                        const values = await Value.findAll({where: {id: productParameterValue.valueId}});
                        values.forEach(value => {
                            console.log("__valueId__", value.id);
                            return valueIds.push(value.id)
                        });
                    }

                } else if (parameter.format === "RADIO") {
                    console.log("RADIO");
                    if (productParameterValues[0]) {
                        const val = await Value.findOne({where: {id: productParameterValues[0].valueId}});
                        valueId = String(val.id);
                    }

                } else if (parameter.format === "INPUT") {
                    console.log("INPUT");
                    if (productParameterValues[0]) {
                        const val = await Value.findByPk(productParameterValues[0].valueId);
                        value = val.type === "COLOR" ? val.value : {value: val.value};
                    }
                }

                info.push({parameterId: parameter.id, valueIds, valueId, value});
            }

            return res.json({...product.dataValues, info});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {id} = req.params;
            let product = await Product.findOne({where: {id}});

            let {
                name, description, price, count, categoryId, info, isDiscount, newPrice,
                img, typeId, brandId, buyCount
            } = req.body;

            if (img && img !== product.img) {
                fs.unlink(`${__dirname}/../static/${product.img}`, () => {
                });
                product.img = img;
            }

            if (isDiscount !== null) product.isDiscount = isDiscount;
            if (newPrice) product.newPrice = newPrice;
            if (name) product.name = name;
            if (price) product.price = Number(price);
            if (count) product.count = count;
            if (description) product.description = description;
            if (categoryId) product.categoryId = categoryId;
            if (typeId) product.typeId = typeId;
            if (brandId) product.brandId = brandId;
            if (buyCount) product.buyCount = Number(buyCount);

            const productParameters = await ProductParameter.findAll({where: {productId: product.id}});

            for (const productParameter of productParameters) {
                const productParameterValue = await ProductParameterValue.findOne({where: {productParameterId: productParameter.id}});
                if (productParameterValue) {
                    const value = await Value.findOne({where: {id: productParameterValue.valueId}});
                    if (!value.parameterId) await value.destroy();
                    await productParameterValue.destroy();
                }
            }

            await ProductParameter.destroy({where: {productId: product.id}});

            if (info && info.length !== 0) {
                for (const i of info) {
                    const parameter = await Parameter.findByPk(i.parameterId);

                    const productParameter = await ProductParameter.create({
                        parameterId: i.parameterId,
                        productId: product.id
                    })

                    if (parameter.format === "CHECKBOX") {
                        for (const valueId of i.valueIds) {
                            await ProductParameterValue.create({
                                productParameterId: productParameter.id,
                                valueId: valueId
                            })
                        }
                    }

                    if (parameter.format === "RADIO") {
                        console.log("__RADIO__", i.valueId)
                        await ProductParameterValue.create({
                            productParameterId: productParameter.id,
                            valueId: i.valueId
                        })
                    }

                    if (parameter.format === "INPUT" && i.value) {
                        const value = await Value.create({
                            type: parameter.type,
                            value: i.value.title
                                ? JSON.stringify(i.value)
                                : i.value.value,
                        });

                        console.log("__VAL__", value.id)

                        await ProductParameterValue.create({
                            productParameterId: productParameter.id,
                            valueId: value.id
                        })
                    }
                }
            }

            product.save();
            return res.json(product);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            const productParameters = await ProductParameter.findAll({where: {productId: id}});

            for (const productParameter of productParameters) {
                const productParameterValue = await ProductParameterValue.findOne({where: {productParameterId: productParameter.id}});
                if (productParameterValue) {
                    const value = await Value.findOne({where: {id: productParameterValue.valueId}});
                    if (!value.parameterId) await value.destroy();
                    await productParameterValue.destroy();
                }
            }

            await ProductParameter.destroy({where: {productId: id}});
            await Product.destroy({where: {id}});

            return res.json(getSuccessMessage("Товар успешно удален"));
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new ProductController();