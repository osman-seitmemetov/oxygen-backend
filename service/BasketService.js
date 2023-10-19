const {Basket} = require("../models/models");


class BasketService {
    async create(userId) {
        try {
            return await Basket.create({userId});
        } catch (e) {
            console.log(e)
        }
    }
}

module.exports = new BasketService();