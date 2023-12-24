const uuid = require("uuid");
const path = require("path");
const {FAQGroup, FAQItem, ProductInfo, Category} = require("../models/models");
const fs = require("fs");
const {Op} = require("sequelize");
const ApiError = require("../error/ApiError");

class FAQController {
    async createGroup(req, res, next) {
        try {
            let {title} = req.body;
            let faq_group = await FAQGroup.create({title});

            return res.json(faq_group);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async createItem(req, res, next) {
        try {
            let {title, text} = req.body;
            let faq_item = await FAQItem.create({title, text});

            return res.json(faq_item);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getAll(req, res, next) {
        try {
            let {limit, page, term} = req.query;
            page = page || 1;
            limit = limit || 10;
            let offset = page * limit - limit;
            let faq_groups = await FAQGroup.findAll({limit, offset});

            if (term) {
                faq_groups = await FAQGroup.findAll({
                    where: {title: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}}
                });
            }

            return res.json(faq_groups);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const {id} = req.params;
            const faq_group = await FAQGroup.findOne({where: {id}, include: [{model: FAQItem, as: 'faq_items'}]});

            res.json(faq_group);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteGroup(req, res, next) {
        try {
            const {id} = req.params;
            let faq_group = await FAQGroup.destroy({where: {id}});

            return res.json({message: "Группа вопросов удалена"});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async deleteItem(req, res, next) {
        try {
            const {id} = req.params;
            let faq_item = await FAQItem.destroy({where: {id}});

            return res.json({message: "Вопрос удален"});
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async editGroup(req, res, next) {
        try {
            const {id} = req.params;
            const {title} = req.body;
            let faq_group = await FAQGroup.findOne({where: {id}});
            faq_group.title = title;

            faq_group.save();
            return res.json(faq_group);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async editItem(req, res, next) {
        try {
            const {id} = req.params;
            const body = req.body;

            let faq_item = await FAQItem.findOne({where: {id}});

            if(body.title) faq_item.title = body.title;
            if(body.text) faq_item.text = body.text;
            if(body.faqGroupId) faq_item.faqGroupId = body.faqGroupId;

            faq_item.save();
            return res.json(faq_item);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new FAQController();