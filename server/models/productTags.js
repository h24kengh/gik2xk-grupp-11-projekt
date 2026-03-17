module.exports = (sequelize, DataTypes) => {
    return sequelize.define("productTags", {}, { underscored: true });
};