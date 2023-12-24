const {Basket, Product, ProductInfo, BasketProduct, Favorites, FavoritesProduct} = require("../../models/models");
const {DataTypes} = require("sequelize");


class FavoritesController {
    async getFavorites(req, res) {
        try {
            const {id} = req.user;
            let favorites = await Favorites.findOne({where: {userId: id}});
            const items = [];

            const favoritesProducts = await FavoritesProduct.findAll({where: {favoriteId: favorites.id},});

            for (const favoritesProduct of favoritesProducts) {
                const product = await Product.findByPk(favoritesProduct.productId);

                items.push({id: favoritesProduct.id, product});
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

            res.json({...favorites.dataValues, items: sortedItems});
        } catch (e) {
            console.log(e)
        }
    }

    async addToFavorites(req, res) {
        try {
            const {id} = req.user;
            let favorites = await Favorites.findOne({where: {userId: id}});
            const {productId} = req.body;

            const favoritesProduct = await FavoritesProduct.create({favoriteId: favorites.id, productId});
            const product = await Product.findByPk(productId);

            res.json({id: favoritesProduct.id, product});
        } catch (e) {
            console.log(e)
        }
    }

    async deleteFromFavorites(req, res) {
        try {
            const {id} = req.user;
            let favorites = await Favorites.findOne({where: {userId: id}});
            const {productId} = req.body;

            await FavoritesProduct.destroy({where: {favoriteId: favorites.id, productId}});

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

module.exports = new FavoritesController();