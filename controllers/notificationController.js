const uuid = require("uuid");
const path = require("path");
const {Notification} = require("../models/models");
const fs = require("fs");
const ApiError = require("../error/ApiError");

class NotificationController {
    async create(req, res, next) {
        try {
            let {title, text, userId} = req.body;
            let notification = await Notification.create({title, text, userId});

            return res.json(notification);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {limit, page} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let notifications = await Notification.findAll({limit, offset});

            return res.json(notifications);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getByUser(req, res, next) {
        try {
            const notification = await Notification.findAll({where: {userId: req.user.id}});
            res.json(notification);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async delete(req, res, next) {
        try {
            const {id} = req.params;
            let notification = await Notification.destroy({where: {id}});

            return res.json({message: "Уведомление удалено"});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
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
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new NotificationController();