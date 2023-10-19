const uuid = require("uuid");
const path = require("path");
const {Banner, Article} = require("../models/models");
const fs = require("fs");
const {Op} = require("sequelize");

class BannerController {
    async create(req, res) {
        try {
            const {img, title, text, link, color} = req.body;
            let banner = await Banner.create({img, title, text, link, color});

            return res.json(banner);
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
            let banners = await Banner.findAll({limit, offset});

            return res.json(banners);
        } catch (e) {
            console.log(e);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;
            let banner = await Banner.findByPk(id);

            return res.json(banner);
        } catch (e) {
            console.log(e);
        }
    }

    async deleteAll(req, res) {
        try {
            await Banner.destroy();

            return res.json({message: "Все баннеры удалены"});
        } catch (e) {
            console.log(e);
        }
    }

    async deleteOne(req, res) {
        try {
            const {id} = req.params;
            let banner = await Banner.destroy({where: {id}});

            return res.json({message: "Баннер удален"});
        } catch (e) {
            console.log(e);
        }
    }

    async edit(req, res) {
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
            console.log(e);
        }
    }
}

module.exports = new BannerController();