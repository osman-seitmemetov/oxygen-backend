const {DataTypes, where, Op} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const {Article, Order, Product, Notification} = require("../models/models");
const fs = require("fs");
const sequelize = require("../db");

class OrderController {
    async create(req, res) {
        try {
            let {status, deliveryAddress, requestDate, deliveryDate, orderSum, deliverySum, globalSum, type, userId} = req.body;

            let order = await Order.create({
                status, deliveryAddress, requestDate,
                deliveryDate, orderSum, deliverySum,
                globalSum, type, userId
            });

            return res.json(order);
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
            let orders = await Order.findAll({limit, offset});

            if (term) {
                orders = await Order.findAll({
                    where: {id: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            return res.json(orders);
        } catch (e) {
            console.log(e);
        }
    }

    async getByUser(req, res) {
        try {
            const order = await Order.findAll({where: {userId: req.user.id}});

            res.json(order);
        } catch (e) {
            console.log(e);
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params;
            const order = await Order.findOne({where: {id}, include: [{model: Product, as: 'order_products'}]});

            res.json(order);
        } catch (e) {
            console.log(e);
        }
    }

    async deleteAll(req, res) {
        try {
            let order = await Order.destroy({where: {}});

            return res.json({message: "Все заказы удалены"});
        } catch (e) {
            console.log(e);
        }
    }

    async deleteOne(req, res) {
        try {
            const {id} = req.params;
            let order = await Order.destroy({where: {id}});

            return res.json({message: "Заказ удален"});
        } catch (e) {
            console.log(e);
        }
    }

    async edit(req, res) {
        try {
            // const {id} = req.params;
            //
            // const {title, text, date} = req.body;
            //
            // let order = await Order.findOne({where: {id}});
            //
            // if(title) article.title = title;
            // if(text) article.text = text;
            // if(date) article.date = date;
            //
            // article.save();
            // return res.json(article);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new OrderController();