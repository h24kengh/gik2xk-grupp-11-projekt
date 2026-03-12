module.exports = (sequelize, DataTypes) => {
  return sequelize.define("tag", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },   // ← KOMMA HÄR
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    }
  }, 
  { underscored: true }
);
};