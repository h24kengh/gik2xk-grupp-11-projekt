/**
 * TEKNISKT KRAV: Datalagring & SQL-databas
 * Denna fil definierar schemat för 'Product'-tabellen. Genom att använda Sequelize 
 * säkerställer vi att datatyperna i JavaScript matchar kraven i SQL-databasen.
 */

const { TEXT } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    // Primärnyckel med auto-increment för unik identifiering av varje produkt
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    // Titel med validering: Garanterar att produktnamnet är mellan 2 och 100 tecken
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },
    // Beskrivning använder TEXT för att tillåta längre texter än en standard STRING
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    /**
     * TEKNISKT KRAV: Hantering av pris och numeriska värden
     * DECIMAL(10, 2) används för att undvika avrundningsfel som kan uppstå med flyttal,
     * vilket är kritiskt i en webbshop-miljö.
     */
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },
    // Lagerstatus (inventory_qty) för att hantera funktionskravet kring lagersaldo
    inventory_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    // URL till produktbild för att möjliggöra visning i frontend-gränssnittet
    imageUrl: {
      type: DataTypes.STRING(255)
    }
  }, 
  // 'underscored: true' mappar JavaScript camelCase till SQL snake_case (t.ex. product_id)
  { underscored: true,
    tableName: 'products'
   });

// Product.associate = (models) => {
//   Product.hasMany(models.Rating, {
//     foreignKey: 'product_id',
//     as: 'ratings'
//   });
// };

return Product;
};
