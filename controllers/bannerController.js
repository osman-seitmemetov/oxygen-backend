const uuid = require("uuid");
const path = require("path");
const {Banner, Article} = require("../models/models");
const fs = require("fs");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");

class BannerController {
    async create(req, res, next) {
        try {
            const {img, title, text, link, color} = req.body;
            let banner = await Banner.create({img, title, text, link, color});

            return res.json(banner);
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
            let banners = await Banner.findAll({limit, offset});

            return res.json(banners);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getById(req, res, next) {
        try {
            const {id} = req.params;
            let banner = await Banner.findByPk(id);

            return res.json(banner);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteAll(req, res, next) {
        try {
            await Banner.destroy();

            return res.json({message: "Все баннеры удалены"});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            let banner = await Banner.destroy({where: {id}});

            return res.json({message: "Баннер удален"});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {id} = req.params;
            const {img, title, text, link, color} = req.body;
            let banner = await Banner.findOne({where: {id}});

            if(banner.img !== img) {
                fs.unlink(`${__dirname}/../static/${banner.img}`, () => {});
                banner.img = img;
            }
            banner.title = title;
            banner.text = text;
            banner.link = link;
            banner.color = color;

            banner.save();
            return res.json(banner);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new BannerController();