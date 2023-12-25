const sequelize = require('../db');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true},
    password: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING, allowNull: true},
    firstname: {type: DataTypes.STRING, allowNull: true},
    lastname: {type: DataTypes.STRING, allowNull: true},
    birthday: {type: DataTypes.DATE, allowNull: true},
    gender: {type: DataTypes.STRING, allowNull: true},
    role: {type: DataTypes.STRING, defaultValue: "USER"},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING}
}, {timestamps: false});

const Token = sequelize.define('token', {
    refreshToken: {type: DataTypes.STRING(600), allowNull: false}
}, {timestamps: false});

const Basket = sequelize.define('basket', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER, defaultValue: 0},
    deliverySum: {type: DataTypes.INTEGER, defaultValue: 0},
    sum: {type: DataTypes.INTEGER, defaultValue: 0},
    globalSum: {type: DataTypes.INTEGER, defaultValue: 0},
    discount: {type: DataTypes.INTEGER, defaultValue: 0}
}, {timestamps: false});

const BasketProduct = sequelize.define('basket_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    count: {type: DataTypes.INTEGER, defaultValue: 1},
}, {timestamps: false});

const Favorites = sequelize.define('favorites', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false});

const FavoritesProduct = sequelize.define('favorites_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false});

const Product = sequelize.define('product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    description: {type: DataTypes.STRING(2000), allowNull: false},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    newPrice: {type: DataTypes.INTEGER},
    count: {type: DataTypes.INTEGER, allowNull: false},
    isDiscount: {type: DataTypes.BOOLEAN, defaultValue: false},
    img: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false});

const Parameter = sequelize.define('parameter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    type: {type: DataTypes.STRING, allowNull: false},
    format: {type: DataTypes.STRING, allowNull: false},
}, {timestamps: false});

const Value = sequelize.define('value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    type: {type: DataTypes.STRING},
    value: {type: DataTypes.STRING}
}, {timestamps: false});

//////
const ColorValue = sequelize.define('color_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING},
    value: {type: DataTypes.STRING}
}, {timestamps: false});

const TextValue = sequelize.define('text_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.STRING}
}, {timestamps: false});

const NumberValue = sequelize.define('number_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.INTEGER}
}, {timestamps: false});

const BooleanValue = sequelize.define('boolean_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    value: {type: DataTypes.BOOLEAN}
}, {timestamps: false});
//////

const ProductParameter = sequelize.define('product_parameter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false});

///////
const ProductParameterColorValue = sequelize.define('product_parameter_color_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const ProductParameterTextValue = sequelize.define('product_parameter_text_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const ProductParameterNumberValue = sequelize.define('product_parameter_number_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});

const ProductParameterBooleanValue = sequelize.define('product_parameter_boolean_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
});
////////

const ProductParameterValue = sequelize.define('product_parameter_value', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false});

////////
const FilterGroup = sequelize.define('filter_group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false}
});

const FilterOption = sequelize.define('filter_option', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false}
});
/////////

const Category = sequelize.define('category', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    parentId: {type: DataTypes.INTEGER},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING(1500), allowNull: false},
    icon: {type: DataTypes.STRING},
    img: {type: DataTypes.STRING},
    lvl: {type: DataTypes.INTEGER, allowNull: false},
    inCatalog: {type: DataTypes.BOOLEAN, defaultValue: false},
    order: {type: DataTypes.INTEGER, defaultValue: null}
}, {timestamps: false});

const Brand = sequelize.define('brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
    description: {type: DataTypes.STRING},
    logo: {type: DataTypes.STRING}
}, {timestamps: false});

const Type = sequelize.define('type', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false}
}, {timestamps: false});

const TypeParameter = sequelize.define('type_parameter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
}, {timestamps: false});

const Banner = sequelize.define('banner', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    img: {type: DataTypes.STRING, allowNull: false},
    title: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING, allowNull: false},
    link: {type: DataTypes.STRING},
    color: {type: DataTypes.STRING},
}, {timestamps: false});

const Notification = sequelize.define('notification', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING, allowNull: false},
    read: {type: DataTypes.BOOLEAN, defaultValue: false},
    date: {type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')},
}, {timestamps: false});

const Article = sequelize.define('article', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING(3000), allowNull: false},
    bannerImg: {type: DataTypes.STRING},
    previewImg: {type: DataTypes.STRING, allowNull: false},
    date: {type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')},
}, {timestamps: false});

const Order = sequelize.define('order', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    status: {type: DataTypes.STRING, defaultValue: "NOT_PAID"},
    deliveryAddress: {type: DataTypes.STRING},
    requestDate: {type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')},
    deliveryDate: {type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP')},
    orderSum: {type: DataTypes.INTEGER},
    deliverySum: {type: DataTypes.INTEGER},
    globalSum: {type: DataTypes.INTEGER},
    type: {type: DataTypes.STRING, defaultValue: "PARCEL"},
}, {timestamps: false});

const OrderProduct = sequelize.define('order_product', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
}, {timestamps: false});

const FAQGroup = sequelize.define('faq_group', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false}
}, {timestamps: false});

const FAQItem = sequelize.define('faq_item', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.STRING(4000), allowNull: false}
}, {timestamps: false});

const Promocode = sequelize.define('promocode', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    title: {type: DataTypes.STRING, allowNull: false},
    value: {type: DataTypes.STRING, allowNull: false}
}, {timestamps: false});

const UserPromocode = sequelize.define('user_promocode', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    isUsed: {type: DataTypes.BOOLEAN, defaultValue: false}
}, {timestamps: false});

const CategoryPromocode = sequelize.define('category_promocode', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
}, {timestamps: false});

const About = sequelize.define('about', {
    title: {type: DataTypes.STRING, allowNull: false},
    text: {type: DataTypes.TEXT, allowNull: false}
}, {timestamps: false});

const TypeBrand = sequelize.define('type_brand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
}, {timestamps: false});

const CategoryFilterGroup = sequelize.define('category_filter', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true}
}, {timestamps: false});


Parameter.hasOne(Value);
Value.belongsTo(Parameter);

ProductParameter.belongsToMany(Value, {through: ProductParameterValue});
Value.belongsToMany(ProductParameter, {through: ProductParameterValue});




Parameter.hasOne(ColorValue);
ColorValue.belongsTo(Parameter);

Parameter.hasOne(TextValue);
TextValue.belongsTo(Parameter);

Parameter.hasOne(NumberValue);
NumberValue.belongsTo(Parameter);

Parameter.hasOne(BooleanValue);
BooleanValue.belongsTo(Parameter);

ProductParameter.belongsToMany(ColorValue, {through: ProductParameterColorValue});
ColorValue.belongsToMany(ProductParameter, {through: ProductParameterColorValue});

ProductParameter.belongsToMany(NumberValue, {through: ProductParameterNumberValue});
NumberValue.belongsToMany(ProductParameter, {through: ProductParameterNumberValue});

ProductParameter.belongsToMany(TextValue, {through: ProductParameterTextValue});
TextValue.belongsToMany(ProductParameter, {through: ProductParameterTextValue});

ProductParameter.belongsToMany(BooleanValue, {through: ProductParameterBooleanValue});
BooleanValue.belongsToMany(ProductParameter, {through: ProductParameterBooleanValue});


/////
FilterGroup.hasMany(FilterOption);
FilterOption.belongsTo(FilterGroup);

FilterGroup.belongsToMany(Category, {through: CategoryFilterGroup});
Category.belongsToMany(FilterGroup, {through: CategoryFilterGroup});
/////



User.hasMany(Notification);
Notification.belongsTo(User);

User.hasOne(Token);
Token.belongsTo(User);

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(Favorites);
Favorites.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

Product.belongsToMany(Order, {through: OrderProduct});
Order.belongsToMany(Product, {as: 'order_products', through: OrderProduct});

Category.hasMany(Product);
Product.belongsTo(Category);

Type.belongsToMany(Brand, {through: TypeBrand});
Brand.belongsToMany(Type, {through: TypeBrand});

User.hasMany(Notification);
Notification.belongsTo(User);

User.belongsToMany(Promocode, {through: UserPromocode});
Promocode.belongsToMany(User, {through: UserPromocode});

Category.belongsToMany(Promocode, {through: CategoryPromocode});
Promocode.belongsToMany(Category, {through: CategoryPromocode});

Category.hasMany(Type);
Type.belongsTo(Category);

FAQGroup.hasMany(FAQItem);
FAQItem.belongsTo(FAQGroup);

Basket.belongsToMany(Product, {through: BasketProduct});
Product.belongsToMany(Basket, {through: BasketProduct, as: 'products'});

Favorites.belongsToMany(Product, {through: FavoritesProduct});
Product.belongsToMany(Favorites, {through: FavoritesProduct});

Product.belongsToMany(Parameter, {through: ProductParameter, as: 'info'});
Parameter.belongsToMany(Product, {through: ProductParameter});

Type.hasMany(Product);
Product.belongsTo(Type);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Type.belongsToMany(Parameter, {through: TypeParameter});
Parameter.belongsToMany(Type, {through: TypeParameter});

(async () => {
    await sequelize.sync({ alter: true });
})();

module.exports = {
    User, Token, Basket, About, BasketProduct, Product, Category, ProductParameter, Banner, Notification,
    Article, Order, FAQGroup, FAQItem, Promocode, OrderProduct, UserPromocode, Brand, FilterGroup,
    FilterOption, CategoryFilterGroup, Parameter, ColorValue, TextValue, BooleanValue, NumberValue, Type,
    TypeParameter, ProductParameterBooleanValue, ProductParameterColorValue, ProductParameterTextValue,
    ProductParameterNumberValue, TypeBrand, Value, ProductParameterValue, Favorites, FavoritesProduct
};