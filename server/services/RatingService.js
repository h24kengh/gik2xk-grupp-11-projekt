const { rating: Rating } = require('../models');

class RatingService {
  // Lägg till ett nytt betyg (ingen uppdatering längre)

  async addOrUpdateRating(_, productId, value) {
  try {
    value = parseInt(value, 10);
    if (!value || value < 1 || value > 5) {
      throw new Error('Ogiltigt betyg');
    }

    console.log("===== addOrUpdateRating kallad =====");
    console.log("productId:", productId, "value:", value);

    // Skapa ett nytt betyg varje gång
    const rating = await Rating.create({ value, product_id: productId });

    return rating;
  } catch (error) {
    console.error("FELET I RATINGSERVICE:", error.message);
    throw new Error(`Kunde inte spara betyg: ${error.message}`);
  }
}

  // Hämta alla betyg för en produkt
  async getProductRatings(productId) {
    try {
      const ratings = await Rating.findAll({
        where: { product_id: productId },
        attributes: ['value', 'createdAt']
      });

      const averageRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
        : 0;

      return {
        ratings,
        averageRating: parseFloat(averageRating.toFixed(1)),
        totalRatings: ratings.length
      };
    } catch (error) {
      throw new Error(`Kunde inte hämta betyg: ${error.message}`);
    }
  }
}

module.exports = new RatingService();