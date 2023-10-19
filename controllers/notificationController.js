const uuid = require("uuid");
const path = require("path");
const {Notification} = require("../models/models");
const fs = require("fs");

class NotificationController {
    async create(req, res) {
        try {
            let {title, text, userId} = req.body;
            let notification = await Notification.create({title, text, userId});

            return res.json(notification);
        } catch (e) {
            console.log(e);
        }
    }

    async getAll(req, res) {
        try {
            let {limit, page} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let notifications = await Notification.findAll({limit, offset});

            return res.json(notifications);
        } catch (e) {
            console.log(e);
        }
    }

    async getByUser(req, res) {
        try {
            const notification = await Notification.findAll({where: {userId: req.user.id}});
            res.json(notification);
        } catch (e) {
            console.log(e);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;
            let notification = await Notification.destroy({where: {id}});

            return res.json({message: "Уведомление удалено"});
        } catch (e) {
            console.log(e);
        }
    }

    async edit(req, res) {
        try {
            const {id} = req.params;
            const body = req.body;

            let notification = await Notification.findOne({where: {id}});

            if(body.title) notification.title = body.title;
            if(body.text) notification.text = body.text;
            if(body.date) notification.date = body.date;
            if(body.read) notification.read = body.read;
            if(body.userId) notification.userId = body.userId;

            notification.save();
            return res.json(notification);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new NotificationController();