// const ApiError = require('../error/ApiError');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {User, Basket, Promocode, CategoryPromocode, UserPromocode, Category} = require('../models/models');
const userService = require('../service/user-service')
const tokenService = require('../service/token-service')
const {validationResult} = require('express-validator');
const ApiError = require('../error/api-error');
const {Op} = require("sequelize");


class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password, phone, name, lastName, bornDate, gender} = req.body;
            const userData = await userService.registration(email, password, phone, name, lastName, bornDate, gender);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const {term, role} = req.query;
            const users = await userService.getAllUsers(term, role);
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async getUserById(req, res, next) {
        try {
            const {id} = req.params;
            const user = await User.findOne({where: {id}});

            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async editProfile(req, res) {
        try {
            const body = req.body;

            const user = await User.findOne({where: {id: req.user.id}});

            if (body.email) user.email = body.email;
            if (body.phone) user.phone = body.phone;
            if (body.firstname) user.firstname = body.firstname;
            if (body.lastname) user.lastname = body.lastname;
            if (body.birthday) user.birthday = body.birthday;
            if (body.gender) user.gender = body.gender;
            if (body.password) user.password = body.password;
            user.save();

            return res.json(user);
        } catch (e) {
            console.log(e);
        }
    }

    async editUser(req, res) {
        try {
            const {id} = req.params;
            const body = req.body;

            const user = await User.findOne({where: {id}});

            if (body.email) user.email = body.email;
            if (body.phone) user.phone = body.phone;
            if (body.firstname) user.firstname = body.firstname;
            if (body.lastname) user.lastname = body.lastname;
            if (body.birthday) user.birthday = body.birthday;
            if (body.gender) user.gender = body.gender;
            if (body.password) user.password = body.password;
            user.save();

            return res.json(user);
        } catch (e) {
            console.log(e);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            const user = await User.destroy({where: {id: req.user.id}});
            return res.json("Профиль удален");
        } catch (e) {
            console.log(e);
        }
    }

    // async changePassword(req, res) {
    //     try {
    //         const body = req.body;
    //         const user = await User.findOne({where: {id: req.user.id}});
    //
    //         if(body.password) user.password = body.password;
    //         user.save();
    //
    //         return res.json(user);
    //     } catch(e) {
    //         console.log(e);
    //     }
    // }

    async getPromocodes(req, res) {
        try {
            const id = req.user.id;
            const promocodes = [];
            let promocodeModels = await UserPromocode.findAll({where: {userId: id}});

            for (let i = 0; i < promocodeModels.length; i++) {
                let promocode = await Promocode.findOne({where: {id: promocodeModels[i].promocodeId}});
                console.log(`________${promocode.id}`)
                let categoryPromocodes = await CategoryPromocode.findAll({where: {promocodeId: promocode.id}});
                console.log(`________${JSON.stringify(categoryPromocodes)}`)
                let categories = [];
                let categoriesId = [];

                if (categoryPromocodes.length) {
                    for (let i = 0; i < categoryPromocodes.length; i++) {
                        let category = await Category.findByPk(categoryPromocodes[i].categoryId);
                        console.log(`________${JSON.stringify(category)}`)
                        categories.push(category.name);
                        categoriesId.push(String(category.id));
                    }
                }

                promocodes.push({...promocodeModels[i].dataValues, promocode: {...promocode.dataValues, categories, categoriesId}});
            }

            return res.json(promocodes);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new UserController();