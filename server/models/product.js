const { TEXT } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define("product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    inventory_qty: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },

    imageUrl: {
      type: DataTypes.STRING(255)
    }
  }, 
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
