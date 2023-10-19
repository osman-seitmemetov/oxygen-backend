const {Basket, Product, ProductInfo, BasketProduct} = require("../models/models");
const {DataTypes} = require("sequelize");


class BasketController {
    ///////
    async createBasketProduct(req, res) {
        try {
            const {id} = req.user;
            let {count, productId} = req.body;

            const basket = await Basket.findOne({where: {userId: id}})

            let basketProduct = await BasketProduct.create({
                count,
                basketId: basket.id,
                productId
            });

            return res.json(basketProduct);
        } catch (e) {
            console.log(e);
        }
    }

    ////////

    async getBasket(req, res) {
        try {
            const {id} = req.user;
            let basket = await Basket.findOne({where: {userId: id}});
            const items = [];

            const basketProducts = await BasketProduct.findAll({where: {basketId: basket.id},});

            for (const basketProduct of basketProducts) {
                const product = await Product.findByPk(basketProduct.productId);

                items.push({id: basketProduct.id, product, count: basketProduct.count});
            }

            const sortedItems = items.sort((a, b) => {
                if (a.product.name.toLowerCase() < b.product.name.toLowerCase()) {
                    return -1;
                }
                if (a.product.name.toLowerCase() > b.product.name.toLowerCase()) {
                    return 1;
                }
                return 0;
            })

            res.json({...basket.dataValues, items: sortedItems});
        } catch (e) {
            console.log(e)
        }
    }

    async addToBasket(req, res) {
        try {
            const {id} = req.user;
            let basket = await Basket.findOne({where: {userId: id}});
            const {productId} = req.body;

            const basketProduct = await BasketProduct.create({basketId: basket.id, productId});
            const product = await Product.findByPk(productId);

            res.json({id: basketProduct.id, count: basketProduct.count, product, productId: product.id});
        } catch (e) {
            console.log(e)
        }
    }

    async deleteFromBasket(req, res) {
        try {
            const {id} = req.user;
            let basket = await Basket.findOne({where: {userId: id}});
            const {productId} = req.body;

            await BasketProduct.destroy({where: {basketId: basket.id, productId}});

            res.json("Успешно удалено");
        } catch (e) {
            console.log(e)
        }
    }

    async deleteAll(req, res) {
        try {
            const {id} = req.user;
            const basket = await Basket.findOne({where: {userId: id}})
            await BasketProduct.destroy({where: {basketId: basket.id}});

            return res.json("Корзина очищена");
        } catch (e) {
            console.log(e);
        }
    }

    async deleteOne(req, res) {
        const {id} = req.params;
        await BasketProduct.destroy({where: {id}});

        return res.json("Товар удален из корзины");
    }

    async changeCount(req, res) {
        try {
            const {count} = req.body;
            const {id} = req.params;

            if (count) {
                let basketProduct = await BasketProduct.findOne({where: {id}});
                basketProduct.count = count;
                basketProduct.save();

                return res.json(basketProduct);
            } else {
                return res.json("Укажите поле count");
            }
        } catch (e) {
            console.log(e)
        }
    }

    async edit(req, res) {
        try {
            const {id} = req.user;
            // const {count} = req.body;
            let basket = Basket.findOne({where: {userId: id}});
            let basketProduct = await BasketProduct.findAll({
                where: {basketId: basket.id},
                include: [{model: Product, as: 'product'}]
            });

            let count = basketProduct.length,
                deliverySum = 0,
                sum = 0,
                globalSum = 0,
                discount = 0;

            // for (let i = 0; i < BasketProduct.length; i++) {
            //     const product = await Product.findOne()
            //     count += i;
            //     // deliverySum
            //     // sum += BasketProduct[i].product.price
            // }

            basket.count = count;
            basket.save();

            return res.json(basket)
        } catch (e) {
            console.log(e);
        }
    }

    async editBasketProduct(req, res) {
        try {

        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new BasketController();