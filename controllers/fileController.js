const {DataTypes, where} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const {Article} = require("../models/models");
const fs = require("fs");

class FileController {
    async create(req, res) {
        try {
            const {fileType} = req.body;
            const {file} = req.files;
            let fileName;
            if(fileType === 'png') {
                let fileName = `${uuid.v4()}.png`;
                file.mv(path.resolve(__dirname, '..', 'static', fileName));
                return res.json({fileName});
            }

            return res.json({fileName});
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new FileController();