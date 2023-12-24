const {DataTypes, where, Op} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const {About} = require("../models/models");
const fs = require("fs");
const ApiError = require("../error/ApiError");

class AboutController {
    async get(req, res, next) {
        try {
            let about = await About.findAll();

            return res.json(about[0]);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }

    async edit(req, res, next) {
        try {
            const {title, text} = req.body;
            let about = await About.findAll();

            if (title) about[0].title = title;
            if (text) about[0].text = text;

            await about[0].save();
            return res.json(about[0]);
        } catch (e) {
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new AboutController();