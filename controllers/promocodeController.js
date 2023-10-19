const {Promocode, UserPromocode, Product, CategoryPromocode, Category, CategoryProduct} = require("../models/models");
const {Op} = require("sequelize");

class PromocodeController {
    async create(req, res) {
        try {
            let {title, value, categoriesId} = req.body;
            let promocode = await Promocode.create({title, value});

            categoriesId.forEach(categoryId => CategoryPromocode.create({categoryId, promocodeId: promocode.id}));

            return res.json(promocode);
        } catch (e) {
            console.log(e);
        }
    }

    async getAll(req, res) {
        try {
            let {limit, page, term} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let promocodes = [];
            let promocodeModels = await Promocode.findAll({limit, offset});

            for (let i = 0; i < promocodeModels.length; i++) {
                let categoryPromocodes = await CategoryPromocode.findAll({where: {promocodeId: promocodeModels[i].id}});
                let categories = [];
                let categoriesId = [];

                if (categoryPromocodes) {
                    for (let i = 0; i < categoryPromocodes.length; i++) {
                        let category = await Category.findByPk(categoryPromocodes[i].categoryId);
                        categories.push(category.name);
                        categoriesId.push(String(category.id));
                    }
                }

                promocodes.push({...promocodeModels[i].dataValues, categories, categoriesId})
            }

            // if (term) {
            //     promocodes = await Promocode.findAll({
            //         where: {value: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
            //     });
            // }

            return res.json(promocodes);
        } catch (e) {
            console.log(e);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;
            let promocode = await Promocode.findByPk(id);

            let categoryPromocodes = await CategoryPromocode.findAll({where: {promocodeId: promocode.id}});
            let categories = [];
            let categoriesId = [];

            if (categoryPromocodes) {
                for (let i = 0; i < categoryPromocodes.length; i++) {
                    let category = await Category.findByPk(categoryPromocodes[i].categoryId);
                    categories.push(category.name);
                    categoriesId.push(String(category.id));
                }
            }

            return res.json({...promocode.dataValues, categories, categoriesId});
        } catch (e) {
            console.log(e);
        }
    }

    // async getByUser(req, res) {
    //     try {
    //         const userPromocodes = await UserPromocode.findAll({where: {userId: req.user.id}});
    //
    //         let promocode;
    //         let promocodes = [];
    //         if (userPromocodes) {
    //             for (let i = 0; i < userPromocodes.length; i++) {
    //                 promocode = await Promocode.findOne({where: {id: userPromocodes[i].promocodeId}});
    //                 if (promocode) promocodes.push(promocode);
    //             }
    //         }
    //
    //         res.json(promocodes);
    //     } catch (e) {
    //         console.log(e);
    //     }
    // }

    async delete(req, res) {
        try {
            const {id} = req.params;
            let promocode = await Promocode.destroy({where: {id}});

            return res.json({message: "Промокод удален"});
        } catch (e) {
            console.log(e);
        }
    }

    async edit(req, res) {
        try {
            const {id} = req.params;
            const body = req.body;

            let promocode = await Promocode.findOne({where: {id}});

            if (body.title) promocode.title = body.title;
            if (body.value) promocode.value = body.value;

            if (body.categoriesId) {
                await CategoryPromocode.destroy({where: {promocodeId: id}});
                body.categoriesId.forEach(categoryId => CategoryPromocode.create({
                    categoryId,
                    promocodeId: promocode.id
                }));
            }

            promocode.save();
            return res.json(promocode);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new PromocodeController();