// Definierar en kopplingstabellen mellan produkter och taggar (många-till-många-relation)
module.exports = (sequelize, DataTypes) => {
    return sequelize.define("productTags", {}, { underscored: true }); // underscored: true använder snake_case i databasen
};