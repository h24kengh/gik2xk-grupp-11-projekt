const express = require('express');
const router = express.Router();
const ratingService = require('../services/RatingService');

router.post('/products/:productId/ratings', async (req, res) => {
  try {
    const { productId } = req.params;
    const { userId, value } = req.body;
    
    if (!userId || !value || value < 1 || value > 5) {
      return res.status(400).json({ error: 'Ogiltigt betyg' });
    }
    
    const rating = await ratingService.addOrUpdateRating(userId, productId, value);
    res.status(201).json(rating);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/products/:productId/ratings', async (req, res) => {
  try {
    const { productId } = req.params;
    const ratings = await ratingService.getProductRatings(productId);
    res.json(ratings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;