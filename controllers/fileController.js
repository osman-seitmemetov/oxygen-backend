const {DataTypes, where} = require("sequelize");
const uuid = require("uuid");
const path = require("path");
const {Article} = require("../models/models");
const fs = require("fs");
const ApiError = require("../error/ApiError");

class FileController {
    async create(req, res, next) {
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
            next(ApiError.badRequest(e.message));
        }
    }
}

module.exports = new FileController();