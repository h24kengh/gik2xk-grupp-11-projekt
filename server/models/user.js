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
    },
    email: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validator: {
        len: [4, 200], // E-postadressen måste vara mellan 4 och 200 tecken
        isEmail: true  // Validerar att värdet är en giltig e-postadress
      }
    },
    username: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50] // Användarnamnet måste vara mellan 3 och 50 tecken
      }
    },
    firstName: DataTypes.STRING(50),
    lastName: DataTypes.STRING(50),
    description: DataTypes.TEXT,
    imageUrl: {
      type: DataTypes.STRING(255),
      validate: {
        isUrl: true // Validerar att värdet är en giltig URL
      }
    }
  },
  { underscored: true } // Använder snake_case i databasen
);
};