const {DataTypes, where, Op} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const {Article, Product} = require("../models/models");
const fs = require("fs");

class ArticleController {
    async create(req, res) {
        try {
            let {title, text, date, bannerImg, previewImg} = req.body;

            let article = await Article.create({
                title, text, date, bannerImg, previewImg
            });

            return res.json(article);
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
            let articles = await Article.findAll({limit, offset});

            if (term) {
                articles = await Article.findAll({
                    where: {title: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            return res.json(articles);
        } catch (e) {
            console.log(e);
        }
    }

    async getOne(req, res) {
        try {
            const {id} = req.params;
            const article = await Article.findOne({where: {id}});

            res.json(article);
        } catch (e) {
            console.log(e);
        }
    }

    async deleteAll(req, res) {
        try {
            const {id} = req.params;
            let article = await Article.destroy({where: {}});

            return res.json({message: "Все статьи удалены"});
        } catch (e) {
            console.log(e);
        }
    }

    async deleteOne(req, res) {
        try {
            const {id} = req.params;
            let basketProduct = await Article.destroy({where: {id}});

            return res.json({message: "Статья удалена"});
        } catch (e) {
            console.log(e);
        }
    }

    async edit(req, res) {
        try {
            const {id} = req.params;
            const {title, text, date, bannerImg, previewImg} = req.body;

            let article = await Article.findOne({where: {id}});

            if (title) article.title = title;
            if (text) article.text = text;
            if (date) article.date = date;

            if(article.bannerImg !== bannerImg) {
                fs.unlink(`${__dirname}/../static/${article.bannerImg}`, () => {
                });
                article.bannerImg = bannerImg;
            }

            if(article.previewImg !== previewImg) {
                fs.unlink(`${__dirname}/../static/${article.previewImg}`, () => {
                });
                article.previewImg = previewImg;
            }

            article.save();
            return res.json(article);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new ArticleController();