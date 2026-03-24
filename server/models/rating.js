// Definierar Rating-modellen för betyg kopplade till produkter
module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define("rating", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1, // Lägsta tillåtna betyg
        max: 5  // Högsta tillåtna betyg
      }
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true // Kan vara null om användaren inte är inloggad
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false // Varje betyg måste tillhöra en produkt
    }
  }, {
    underscored: true, // Använder snake_case i databasen
    tableName: 'ratings',
    timestamps: true   // Lägger automatiskt till createdAt och updatedAt
  });

  return Rating;
};