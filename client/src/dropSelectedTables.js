// dropSelectedTables.js
const { sequelize, Rating, Product, User } = require('./models'); // lägg till de modeller du vill kunna ta bort

async function dropSelectedTables() {
  try {
    // Lista av tabeller/modeller att ta bort
    const tablesToDrop = [Rating]; // t.ex. Rating. Lägg till fler om du vill: Product, User

    for (const table of tablesToDrop) {
      console.log(`Tar bort tabell: ${table.tableName}`);
      await table.drop();
      console.log(`Tabellen ${table.tableName} borttagen!`);
    }

    console.log("Klart! Alla valda tabeller är borttagna.");
    process.exit(0);
  } catch (err) {
    console.error("Fel vid borttagning:", err);
    process.exit(1);
  }
}

dropSelectedTables();