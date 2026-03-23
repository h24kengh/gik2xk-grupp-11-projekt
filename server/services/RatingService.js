const { Rating, Product } = require('../models');

class RatingService {
  async addOrUpdateRating(userId, productId, value) {
    try {
      const [rating, created] = await Rating.findOrCreate({
        where: { user_id: userId, product_id: productId },
        defaults: { value, user_id: userId, product_id: productId }
      });
      
      if (!created) {
        rating.value = value;
        await rating.save();
      }
      
      return rating;
    } catch (error) {
      throw new Error(`Kunde inte spara betyg: ${error.message}`);
    }
  }
  
  async getProductRatings(productId) {
    try {
      const ratings = await Rating.findAll({
        where: { product_id: productId },
        attributes: ['value', 'user_id', 'createdAt']
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