'use strict';

/**
 * TEKNISKT KRAV: Backend & ORM-ramverk
 * Denna fil konfigurerar Sequelize (ORM) för att skapa en brygga mellan Node.js/Express 
 * och SQL-databasen. Detta automatiserar interaktionen med databasen och ökar säkerheten.
 */

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

// Initiering av Sequelize-instansen baserat på konfigurationsfilen
let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

/**
 * Dynamisk inladdning av modeller:
 * Koden läser av mappen 'models' och importerar automatiskt alla .js-filer.
 * Detta säkerställer en hållbar arkitektur där nya tabeller/entiteter (som 'Product' eller 'User')
 * inkluderas automatiskt utan manuell konfiguration.
 */
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

  // Aktiverar associationer mellan modeller om de finns definierade i respektive fil
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

/**
 * TEKNISKT KRAV: Datalagring & Relationer
 * Här definieras explicita relationer (Associationer) för att spegla SQL-databasens struktur.
 * Vi kopplar samman 'Product' och 'Rating' för att kunna hämta recensioner kopplade till specifika produkter.
 */

// Rating associationer
if (db.rating) {
  db.rating.belongsTo(db.product, {
    foreignKey: 'product_id'
  });
}

// Product associationer
if (db.product) {
  db.product.hasMany(db.rating, {
    foreignKey: 'product_id',
    as: 'ratings'
  });
}

// Exporterar sequelize-objektet så att det kan användas i våra controllers/routes
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

