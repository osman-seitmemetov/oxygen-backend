const {
    Category, CategoryFilterGroup, Product, Type, TypeBrand, Brand, Parameter, TypeParameter, ColorValue,
    BooleanValue, TextValue, NumberValue, Value
} = require('../models/models');
const ApiError = require('../error/ApiError');
const {Op} = require("sequelize");

class CategoryController {
    async create(req, res, next) {
        try {
            const {name, description, icon, filterGroupIds, lvl, parentId, img, order, inCatalog} = req.body;
            const category = await Category.create({name, description, icon, lvl, parentId, img, order, inCatalog});
            filterGroupIds.forEach(filterGroupId => CategoryFilterGroup.create({
                filterGroupId,
                categoryId: category.id
            }))

            return res.json({...category.dataValues, filterGroupIds});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            const {term} = req.query;
            let categories = await Category.findAll();

            if (term) {
                categories = await Category.findAll({
                    where: {name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            return res.json([...categories].sort((a, b) => {
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

    async getChildrenById(req, res, next) {
        try {
            const {id} = req.params;

            if (id && !isNaN(id)) {
                const category = await Category.findByPk(id);

                if (category.lvl === 3) {
                    const parent2Lvl = await Category.findByPk(category.parentId);
                    const parent1Lvl = await Category.findByPk(parent2Lvl.parentId);
                    const types = await Type.findAll({where: {categoryId: category.id}});
                    let typeBrands = [];
                    let brands = [];

                    for (const type of types) {
                        (await TypeBrand.findAll({where: {typeId: type.id}})).forEach(typeBrand => typeBrands.push(typeBrand));
                    }

                    for (const typeBrand of typeBrands) {
                        const brand = await Brand.findByPk(typeBrand.brandId);
                        brands.push(brand);
                    }

                    return res.json({parent1Lvl, parent2Lvl, childCategory3Lvls: [], types, brands});
                } else if (category.lvl === 2) {
                    const parent1Lvl = await Category.findByPk(category.parentId);
                    const childCategory3Lvls = await Category.findAll({where: {parentId: category.id}});
                    let types = [];
                    let typeBrands = [];
                    let brands = [];

                    for (const childCategory3Lvl of childCategory3Lvls) {
                        (await Type.findAll({where: {categoryId: childCategory3Lvl.id}})).forEach(type => types.push(type));
                    }

                    for (const type of types) {
                        (await TypeBrand.findAll({where: {typeId: type.id}})).forEach(typeBrand => typeBrands.push(typeBrand));
                    }

                    for (const typeBrand of typeBrands) {
                        const brand = await Brand.findByPk(typeBrand.brandId);
                        brands.push(brand);
                    }

                    return res.json({parent1Lvl, childCategory3Lvls, types, brands});
                } else if (category.lvl === 1) {
                    const childCategory2Lvls = await Category.findAll({where: {parentId: category.id}});
                    let childCategory3Lvls = [];
                    let types = [];
                    let typeBrands = [];
                    let typeParameters = [];
                    let brands = [];
                    let parameters = [];

                    for (const childCategory2Lvl of childCategory2Lvls) {
                        (await Category.findAll({where: {parentId: childCategory2Lvl.id}}))
                            .forEach(childCategory3Lvl => childCategory3Lvls.push(childCategory3Lvl));
                    }

                    for (const childCategory3Lvl of childCategory3Lvls) {
                        (await Type.findAll({where: {categoryId: childCategory3Lvl.id}})).forEach(type => types.push(type));
                    }

                    for (const type of types) {
                        (await TypeBrand.findAll({where: {typeId: type.id}})).forEach(typeBrand => typeBrands.push(typeBrand));
                        (await TypeParameter.findAll({where: {typeId: type.id}})).forEach(typeParameter => typeParameters.push(typeParameter));
                    }

                    for (const typeBrand of typeBrands) {
                        const brand = await Brand.findByPk(typeBrand.brandId);
                        !brands.find(b => b.id === brand.id) && brands.push(brand);
                    }

                    for (const typeParameter of typeParameters) {
                        const parameter = await Parameter.findByPk(typeParameter.parameterId);

                        const values = await Value.findAll({where: {parameterId: parameter.id}})

                        !parameters.find(param => param.id === parameter.id) && parameters.push({
                            ...parameter.dataValues,
                            values,
                        });
                    }

                    return res.json({childCategory3Lvls, childCategory2Lvls, types, brands, parameters});
                }
            }
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            if (id && !isNaN(id)) {
                let category = await Category.findByPk(id);
                let filterGroupIds = [];
                let categoryFilterGroups = CategoryFilterGroup.findAll({where: {categoryId: category.id}});

                (await categoryFilterGroups).forEach(categoryFilterGroup => filterGroupIds.push(categoryFilterGroup.dataValues.filterGroupId))

                return res.json({...category.dataValues, filterGroupIds});
            }
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {name, description, icon, filterGroupIds, lvl, parentId, img, order, inCatalog} = req.body;
            const {id} = req.params;

            let category = await Category.findByPk(id);
            category.name = name;
            category.description = description;
            category.icon = icon;
            category.lvl = lvl;
            category.parentId = parentId;
            category.img = img;
            category.order = order;
            category.inCatalog = Boolean(inCatalog);
            await category.save();

            await CategoryFilterGroup.destroy({where: {categoryId: category.id}});
            filterGroupIds.forEach(filterGroupId => CategoryFilterGroup.create({
                filterGroupId,
                categoryId: category.id
            }));

            return res.json("Категория успешно изменена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            console.log("__id__", id)
            await Category.destroy({where: {id}});

            return res.json("Категория успешно удалена");
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getCatalog(req, res, next) {
        try {
            const categoriesFirstLevel = await Category.findAll({where: {parentId: null}});

            const catalog = []

            for (const categoryFirstLevel of categoriesFirstLevel) {
                const children = [];
                const categoriesSecondLevel = await Category.findAll({where: {parentId: categoryFirstLevel.id}});

                for (const categorySecondLevel of categoriesSecondLevel) {
                    const categoriesThirdLevel = await Category.findAll({where: {parentId: categorySecondLevel.id}});
                    children.push(categorySecondLevel, ...categoriesThirdLevel)
                }
                catalog.push({parent: categoryFirstLevel, children})
            }

            return res.json(catalog);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}


module.exports = new CategoryController();