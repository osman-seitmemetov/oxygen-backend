const {User, Token, Product} = require("../models/models");
const bcrypt = require("bcrypt");
const mailService = require("./mail-service");
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const uuid = require('uuid');
const ApiError = require('../error/api-error');
const BasketService = require('../service/BasketService');
const {Op} = require("sequelize");

class UserService {
    async registration(email, password, phone, name, lastName, bornDate, gender) {
        const candidate = await User.findOne({
            where: {email}
        });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }

        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();

        const user = await User.create({
            email,
            password: hashPassword,
            activationLink,
            phone,
            name,
            lastName,
            bornDate,
            gender
        });

        const basket = await BasketService.create(user.id);
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);


        const userDto = new UserDto(user); // id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async activate(activationLink) {
        const user = await User.findOne({where: {activationLink}});

        if (!user) {
            throw ApiError.BadRequest('Некорректная ссылка активации');
        }

        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({where: {email}});
        console.log(user, "user")
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден');
        }

        console.log(user.password, 'upass');
        console.log(password, 'pass');

        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = tokenService.validateRefreshToken(refreshToken);
        const tokenFromDb = await Token.findOne({where: {userId: userData.id}});

        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }

        const user = await User.findOne({where: {id: userData.id}});
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {...tokens, user: userDto};
    }

    async getAllUsers(term, role) {
        let users = await User.findAll();

        if (term) {
            users = await User.findAll({
                where: {
                    [Op.or]: [
                        {firstname: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}},
                        {lastname: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}}},
                    ]
                }
            });
        }

        if (role && term) {
            users = await User.findAll({
                where: {
                    name: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}},
                    lastName: {[Op.or]: {[Op.iLike]: `%${term}%`, [Op.substring]: term}},
                    role: role.toUpperCase()
                }
            });
        }

        return users;
    }

}

module.exports = new UserService();