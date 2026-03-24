/**
 * TEKNISKT KRAV: Datalagring & Användarhantering
 * Denna modell definierar 'User'-tabellen i SQL-databasen. 
 * Genom Sequelize säkerställer vi att användardata valideras innan den sparas,
 * vilket höjer applikationens säkerhet och dataintegritet.
 */

const { Op } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  return sequelize.define("user", {
    // Primärnyckel för unik identifiering av användare
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },   // ← KOMMA HÄR
email: {
      type: DataTypes.STRING(200),
        allowNull: false,
      validator: {
        len: [4, 200],
        isEmail: true
      }
    },
  username: {
    type: DataTypes.STRING(50),
      allowNull: false,
    validate: {
      len: [3, 50]
    }
  },
  firstName: DataTypes.STRING(50),
  lastName: DataTypes.STRING(50),
  description: DataTypes.TEXT,
  imageUrl: {
    type: DataTypes.STRING(255),
    validate: {
      isUrl: true
    }
  }
},
  { underscored: true }
);
};