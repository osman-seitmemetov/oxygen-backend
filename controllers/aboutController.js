const {DataTypes, where, Op} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const {About} = require("../models/models");
const fs = require("fs");

class AboutController {
    async get(req, res) {
        try {
            let about = await About.findAll();

            return res.json(about[0]);
        } catch (e) {
            console.log(e);
        }
    }

    async edit(req, res) {
        try {
            const {title, text} = req.body;
            let about = await About.findAll();

            if (title) about[0].title = title;
            if (text) about[0].text = text;

            await about[0].save();
            return res.json(about[0]);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new AboutController();