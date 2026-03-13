module.exports = (sequelize, DataTypes) => {
  return sequelize.define("product", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },   // ← KOMMA HÄR

    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        len: [2, 100]
      }
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false
    },

    imageUrl: {
      type: DataTypes.STRING(255)
    }
  }, 
  { underscored: true });
};